// src/controllers/ProfileController.ts
import type { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService.js';

/**
 * Controller responsável por exibir e atualizar o perfil do usuário autenticado.
 * Segue o padrão MVC do projeto: Controller -> Service -> Repository.
 */
export class ProfileController {
  constructor(private readonly svc: ProfileService) {}

  /** Renderiza o formulário de edição com os dados atuais */
  editForm = async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid as string;
      const player = await this.svc.me(uid);
      if (!player) return res.redirect('/auth?error=not_found');
      res.render('profile-edit', { title: 'Editar perfil', subtitle: '', player });
    } catch (e: any) {
      console.error('[profile_editForm_error]', e?.message || e);
      return res.redirect('/home?error=profile_load');
    }
  };

  /** Atualiza os dados enviados pelo formulário */
  update = async (req: Request, res: Response) => {
    try {
      const uid = (req as any).uid as string;

      const payload = {
        uid,
        name: req.body.name,
        languages: req.body.languages?.split(',').map((s: string) => s.trim()),
        platforms: req.body.platforms?.split(',').map((s: string) => s.trim()),
        favoriteGameIds: req.body.favoriteGameIds?.split(',').map((s: string) => s.trim()),
        favoriteGenres: req.body.favoriteGenres?.split(',').map((s: string) => s.trim()),
        // photoUrl é tratado no Repository se necessário
      };

      await this.svc.update(payload);
      return res.redirect(303, '/home');
    } catch (e: any) {
      console.error('[profile_update_error]', e?.message || e);
      return res.redirect(303, '/profile/edit?error=update_failed');
    }
  };
}
