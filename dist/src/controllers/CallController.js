export class CallController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    /** Lista todos os chamados abertos e renderiza na home (ou endpoint JSON) */
    listOpen = async (req, res) => {
        try {
            // Parse query parameters for filters
            const filters = {};
            if (req.query.gameId && typeof req.query.gameId === 'string') {
                filters.gameId = req.query.gameId.trim().toLowerCase();
            }
            if (req.query.callFriendly && (req.query.callFriendly === 'friendly' || req.query.callFriendly === 'competitive')) {
                filters.callFriendly = req.query.callFriendly;
            }
            if (req.query.playstyles && typeof req.query.playstyles === 'string') {
                filters.playstyles = req.query.playstyles.split(',').map(s => s.trim());
            }
            if (req.query.search && typeof req.query.search === 'string') {
                filters.search = req.query.search.trim().toLowerCase();
            }
            const calls = await this.svc.listOpen(30, filters); // Ou o número que você deseja
            // Se não houver chamados, passa 'calls' como um array vazio
            const callsToRender = calls.length > 0 ? calls : [];
            // Compute unique filter options from calls
            const uniqueGames = new Set();
            const uniqueCallFriendly = new Set();
            const uniquePlaystyles = new Set();
            calls.forEach(call => {
                uniqueGames.add(call.gameId.toLowerCase());
                uniqueCallFriendly.add(call.callFriendly);
                call.playstyles.forEach(style => uniquePlaystyles.add(style));
            });
            // Se for API (Accept: application/json), retorna JSON
            if (req.headers.accept?.includes('application/json')) {
                return res.status(200).json({
                    calls,
                    filterOptions: {
                        games: Array.from(uniqueGames),
                        callFriendly: Array.from(uniqueCallFriendly),
                        playstyles: Array.from(uniquePlaystyles)
                    }
                });
            }
            // Se for EJS, renderiza a home com os chamados e opções de filtro
            res.render('home', {
                title: 'Home',
                subtitle: '',
                player: req.player, // Passando as informações do jogador
                calls: callsToRender, // Passando os chamados (ou array vazio)
                filterOptions: {
                    games: Array.from(uniqueGames),
                    callFriendly: Array.from(uniqueCallFriendly),
                    playstyles: Array.from(uniquePlaystyles)
                }
            });
        }
        catch (e) {
            console.error('[call_listOpen_error]', e?.message || e);
            return res.status(500).json({ error: e?.message || 'list_calls_error' });
        }
    };
    /** Cria um novo chamado */
    create = async (req, res) => {
        try {
            const uid = req.uid;
            const { title, gameId, platform, callFriendly, playstyles } = req.body;
            const call = await this.svc.create({ ownerUid: uid, title, gameId, platform, callFriendly, playstyles });
            // Sempre retorna JSON para requisições AJAX/fetch
            if (req.headers.accept?.includes('application/json') || req.xhr || req.headers['content-type']?.includes('application/json')) {
                return res.status(200).json(call);
            }
            // Redireciona para a página de detalhes do chamado após a criação
            return res.redirect(`/calls/${call.id}`); // Redirecionando para a página do chamado
        }
        catch (e) {
            console.error('[call_create_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'create_call_error' });
        }
    };
    /** Entra em um chamado existente */
    join = async (req, res) => {
        try {
            const uid = req.uid;
            const { id } = req.params;
            const call = await this.svc.join(id, uid);
            if (req.headers.accept?.includes('application/json')) {
                return res.status(200).json(call);
            }
            return res.redirect(`/calls/${id}`);
        }
        catch (e) {
            console.error('[call_join_error]', e?.message || e);
            const code = e?.message || 'join_error';
            return res.status(400).json({ error: code });
        }
    };
    /** Fecha um chamado (somente o dono) */
    close = async (req, res) => {
        try {
            const ownerUid = req.uid;
            const { id } = req.params;
            const call = await this.svc.close(id, ownerUid);
            if (req.headers.accept?.includes('application/json')) {
                return res.status(200).json(call);
            }
            return res.redirect('/home');
        }
        catch (e) {
            console.error('[call_close_error]', e?.message || e);
            const code = e?.message || 'close_error';
            return res.status(400).json({ error: code });
        }
    };
    /** Remove um participante do chamado (somente o dono) */
    removeParticipant = async (req, res) => {
        try {
            const ownerUid = req.uid;
            const { id, participantUid } = req.params;
            // Verifica se o usuário logado é o dono
            const call = await this.svc.getById(id);
            if (!call || call.ownerUid !== ownerUid) {
                return res.status(403).json({ error: 'forbidden' });
            }
            // Remove o participante
            const updatedCall = await this.svc.removeParticipant(id, participantUid);
            if (req.headers.accept?.includes('application/json')) {
                return res.status(200).json(updatedCall);
            }
            return res.redirect(`/calls/${id}`);
        }
        catch (e) {
            console.error('[call_removeParticipant_error]', e?.message || e);
            const code = e?.message || 'remove_participant_error';
            return res.status(400).json({ error: code });
        }
    };
    /** Exibe os detalhes de um chamado (participantes, chat etc.) */
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const call = await this.svc.getById(id);
            if (!call)
                return res.status(404).send('Chamado não encontrado');
            // Obtem o player (usuário logado) do `req`
            const player = req.player;
            // Busca dados dos participantes
            const { adminDb } = await import('../config/firebaseAdmin.js');
            const { PLAYERS_COLLECTION } = await import('../models/Player.js');
            const participantsData = await Promise.all(call.participants.map(async (uid) => {
                const doc = await adminDb.collection(PLAYERS_COLLECTION).doc(uid).get();
                return doc.exists ? { uid, ...doc.data() } : { uid, name: 'Unknown', photoUrl: null };
            }));
            // Debug: Verifique se o player está sendo passado corretamente
            console.log('Player:', player);
            console.log('Call Owner:', call.ownerUid);
            // Passa o player junto com o chamado para a view
            res.render('calls/detail', {
                title: call.title,
                subtitle: `Jogo: ${call.gameId}`,
                call,
                player, // Passando as informações do jogador (para verificar dono)
                participantsData, // Dados dos participantes
            });
        }
        catch (e) {
            console.error('[call_getById_error]', e?.message || e);
            return res.status(400).json({ error: e?.message || 'get_call_error' });
        }
    };
}
