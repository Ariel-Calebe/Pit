// src/routes.ts
import { Router } from 'express';
import multer from 'multer';
import { AuthRepository } from './repositories/firebase/AuthRepository.js';
import { AuthService } from './services/AuthService.js';
import { AuthController } from './controllers/AuthController.js';
import { OnboardingRepositoryFirebase } from './repositories/firebase/OnboardingRepositoryFirebase.js';
import { OnboardingService } from './services/OnboardingService.js';
import { OnboardingController } from './controllers/OnboardingController.js';
import { EditProfileRepositoryFirebase } from './repositories/firebase/EditProfileRepositoryFirebase.js';
import { EditProfileService } from './services/EditProfileService.js';
import { EditProfileController } from './controllers/EditProfileController.js';
import { PresenceRepositoryFirebase } from './repositories/firebase/PresenceRepositoryFirebase.js';
import { PresenceService } from './services/PresenceService.js';
import { PresenceController } from './controllers/PresenceController.js';
import { CallRepositoryFirebase } from './repositories/firebase/CallRepositoryFirebase.js';
import { CallService } from './services/CallService.js';
import { CallController } from './controllers/CallController.js';
import { AmigoRepositoryFirebase } from './repositories/firebase/AmigoRepositoryFirebase.js';
import { AmigoService } from './services/AmigoService.js';
import { AmigoController } from './controllers/AmigoController.js';
import { requireAuth } from './web/middlewares/requireAuth.js';
import { adminDb } from './config/firebaseAdmin.js';
import { PLAYERS_COLLECTION } from './models/Player.js';
export const routes = Router();
/* ------------------------ Auth ------------------------ */
const authRepo = new AuthRepository();
const authSvc = new AuthService(authRepo);
const authCtrl = new AuthController(authSvc);
routes.post('/auth/signup', authCtrl.signUp);
routes.post('/auth/login', authCtrl.login);
routes.post('/auth/reset-password', authCtrl.resetPassword);
routes.post('/auth/google', authCtrl.googleLogin);
routes.get('/auth', (_req, res) => res.redirect(303, '/login'));
routes.get('/login', (req, res) => res.render('auth/login', {
    title: 'Login',
    subtitle: '',
    error: req.query.error || '',
    code: req.query.code || '',
}));
routes.get('/register', (req, res) => res.render('auth/register', {
    title: 'Cadastro',
    subtitle: '',
    error: req.query.error || '',
    code: req.query.code || '',
}));
routes.get('/terms', (req, res) => res.render('terms', {
    title: 'Termos de Uso',
    subtitle: '',
}));
/* ------------------------ Upload Config ------------------------ */
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(_req, file, cb) {
        const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
        if (ok)
            cb(null, true);
        else
            cb(new Error('unsupported_image_type'));
    },
});
/* ------------------------ Onboarding (MVC) ------------------------ */
const onboardingRepo = new OnboardingRepositoryFirebase();
const onboardingSvc = new OnboardingService(onboardingRepo);
const onboardingCtrl = new OnboardingController(onboardingSvc);
routes.get('/onboarding', requireAuth, onboardingCtrl.form);
routes.post('/onboarding', requireAuth, upload.single('avatar'), onboardingCtrl.submit);
/* ------------------------ Edit Profile (MVC) ------------------------ */
const editProfileRepo = new EditProfileRepositoryFirebase();
const editProfileSvc = new EditProfileService(editProfileRepo);
const editProfileCtrl = new EditProfileController(editProfileSvc);
routes.get('/profile/edit', requireAuth, editProfileCtrl.form);
routes.post('/profile/edit', requireAuth, upload.single('avatar'), editProfileCtrl.update);
routes.patch('/profile/edit/:field', requireAuth, editProfileCtrl.partialUpdate);
/* ------------------------ Presence (MVC) ------------------------ */
const presenceRepo = new PresenceRepositoryFirebase();
const presenceSvc = new PresenceService(presenceRepo);
const presenceCtrl = new PresenceController(presenceSvc);
routes.post('/presence/online', requireAuth, presenceCtrl.online);
routes.post('/presence/offline', requireAuth, presenceCtrl.offline);
routes.post('/presence/ping', requireAuth, presenceCtrl.ping);
routes.get('/players/online', requireAuth, presenceCtrl.listOnline);
routes.get('/players/online/similar', requireAuth, presenceCtrl.listSimilar);
/* ------------------------ Call (Chamados) ------------------------ */
const callRepo = new CallRepositoryFirebase();
const callSvc = new CallService(callRepo);
const callCtrl = new CallController(callSvc);
// Rota para listar os chamados
routes.get('/calls', requireAuth, callCtrl.listOpen); // Lista chamados abertos
routes.post('/calls', requireAuth, callCtrl.create); // Cria novo chamado
routes.post('/calls/:id/join', requireAuth, callCtrl.join); // Participa de um chamado
routes.post('/calls/:id/close', requireAuth, callCtrl.close); // Fecha um chamado
routes.get('/calls/:id', requireAuth, callCtrl.getById); // Detalhes do chamado
routes.post('/calls/:id/remove/:participantUid', requireAuth, callCtrl.removeParticipant); // Remove participante
/* ------------------------ Friends (Amigos) ------------------------ */
const amigoRepo = new AmigoRepositoryFirebase();
const amigoSvc = new AmigoService(amigoRepo);
const amigoCtrl = new AmigoController(amigoSvc);
routes.get('/friends', requireAuth, amigoCtrl.list); // Lista amigos e solicitações
routes.post('/friends/add', requireAuth, amigoCtrl.addFriend); // Adiciona amigo
routes.post('/friends/:friendUid/remove', requireAuth, amigoCtrl.removeFriend); // Remove amigo
routes.post('/friends/:friendUid/accept', requireAuth, amigoCtrl.acceptRequest); // Aceita solicitação
routes.post('/friends/:friendUid/reject', requireAuth, amigoCtrl.rejectRequest); // Rejeita solicitação
/* ------------------------ Home ------------------------ */
routes.get('/home', requireAuth, async (req, res) => {
    const uid = req.uid;
    // Obtem o player (usuário logado)
    const doc = await adminDb.collection(PLAYERS_COLLECTION).doc(uid).get();
    const player = doc.exists ? doc.data() : null;
    // Recupera os chamados abertos
    const calls = await callSvc.listOpen(30); // 30 é o número máximo de chamados a ser exibido, altere conforme necessário
    // Passando player e chamados para a view
    res.render('home', {
        title: 'Home',
        subtitle: '',
        player, // Passando as informações do jogador
        calls, // Passando os chamados para a view
    });
});
/* ------------------------ Root (Opção A) ------------------------ */
routes.get('/', (_req, res) => res.redirect('/auth'));
/* ------------------------ Health ------------------------ */
routes.get('/health', (_req, res) => res.status(200).send('ok'));
export default routes;
