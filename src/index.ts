import "./config/firebaseAdmin";
import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/firebase";


import { AuthRepositoryFirebase } from "./repositories/firebase/AuthRepositoryFirebase";
import { AuthService } from "./services/AuthService";
import { AuthController } from "./controllers/AuthController";
import { ProfileRepositoryFirebase } from "./repositories/firebase/ProfileRepositoryFirebase"; 
import { ProfileService } from "./services/ProfileService";                                     
import { ProfileController } from "./controllers/ProfileController";  
import { requireAuth } from "./web/middlewares/requireAuth";
import { AuthGoogleRepository } from "./repositories/firebase/AuthGoogleRepository";
import { CallRepositoryFirebase } from "./repositories/firebase/CallRepositoryFirebase";
import { CallService } from "./services/CallService";
import { CallController } from "./controllers/CallController";
import { PlayersService } from "./services/PlayersService";
import { PlayersController } from "./controllers/PlayersController";

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const authCtrl = new AuthController(new AuthService(new AuthRepositoryFirebase()));
app.post("/auth/signup", authCtrl.signUp); 
app.post("/auth/login", authCtrl.login);
app.post("/auth/reset-password", authCtrl.resetPassword);

const profileCtrl = new ProfileController(
  new ProfileService(new ProfileRepositoryFirebase())
);
app.post("/profile/setup", requireAuth, profileCtrl.setup);
app.get("/profile/me",   requireAuth, profileCtrl.me);

const authGoogleCtrl = new AuthController(new AuthService(new AuthGoogleRepository()));
app.post("/auth/google", authGoogleCtrl.googleLogin); 

const callCtrl = new CallController(new CallService(new CallRepositoryFirebase()));
app.post("/calls", requireAuth, callCtrl.create);           // criar chamado (autenticado)
app.get("/calls", callCtrl.listOpen);                       // listar abertos (público)
app.get("/calls/:id", callCtrl.get);                        // obter um chamado
app.post("/calls/:id/join", requireAuth, callCtrl.join);    // entrar no chamado
app.post("/calls/:id/close", requireAuth, callCtrl.close);  // fechar (apenas dono)

const playersCtrl = new PlayersController(new PlayersService(new ProfileRepositoryFirebase()));
app.get("/players/:id", playersCtrl.getById);   // RF06 (público)


app.get("/health", (_, r) => r.send("ok"));
app.listen(3000, () => console.log("API http://localhost:3000"));
