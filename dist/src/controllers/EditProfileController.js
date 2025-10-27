/**
 * Controller responsável pela edição de perfil do usuário.
 * Segue o padrão MVC → Controller → Service → Repository.
 */
export class EditProfileController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    /** Renderiza o formulário com os dados atuais do perfil */
    form = async (req, res) => {
        try {
            const uid = req.uid;
            const player = await this.svc.me(uid);
            if (!player)
                return res.redirect('/auth?error=not_found');
            res.render('profile-edit', { title: 'Editar perfil', subtitle: '', player });
        }
        catch (e) {
            console.error('[editProfile_form_error]', e?.message || e);
            res.redirect('/home?error=profile_load');
        }
    };
    /** Recebe as alterações do formulário e salva no Firestore */
    update = async (req, res) => {
        try {
            const uid = req.uid;
            const payload = {
                uid,
                name: req.body.name,
                country: req.body.country,
                languages: req.body.languages?.split(',').map((s) => s.trim()),
                platforms: req.body.platforms?.split(',').map((s) => s.trim()),
                favoriteGameIds: req.body.games?.split(',').map((s) => s.trim()),
                favoriteGenres: req.body.genres?.split(',').map((s) => s.trim()),
                styles: req.body.styles?.split(',').map((s) => s.trim()),
                avatar: req.body.avatar, // filename like 'Ariel.png'
                photoUrl: req.body.avatar ? `/images/avatares_players/${req.body.avatar}` : undefined,
            };
            await this.svc.update(payload);
            return res.redirect(303, '/home');
        }
        catch (e) {
            console.error('[editProfile_update_error]', e?.message || e);
            return res.redirect(303, '/profile/edit?error=update_failed');
        }
    };
    /** Partial update for individual fields */
    partialUpdate = async (req, res) => {
        try {
            const uid = req.uid;
            const { field } = req.params;
            const { value } = req.body;
            if (!field || value === undefined) {
                return res.status(400).json({ error: 'Field and value are required' });
            }
            let processedValue = value;
            // Process array fields
            if (['languages', 'platforms', 'favoriteGameIds', 'favoriteGenres', 'styles'].includes(field)) {
                processedValue = Array.isArray(value) ? value : value.split(',').map((s) => s.trim());
            }
            // Process avatar field
            if (field === 'avatar') {
                processedValue = value; // filename like 'Ariel.png'
            }
            const payload = {
                uid,
                [field]: processedValue,
                ...(field === 'avatar' && { photoUrl: value ? `/images/avatares_players/${value}` : undefined }),
            };
            await this.svc.partialUpdate(payload);
            return res.json({ success: true });
        }
        catch (e) {
            console.error('[editProfile_partialUpdate_error]', e?.message || e);
            return res.status(500).json({ error: 'Update failed' });
        }
    };
}
