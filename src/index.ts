import express, { type Request, response, Response } from 'express';
import * as path from 'path';
import { getPosts, deletePost, getPost, IPost } from './db';

// Create an instance of Express
const app = express();

// Serving public directory
// app.use(express.static(path.join(__dirname,'public')));

// Récupération d'un seul et unique post avec toutes les informations de ce dernier.
app.get('/post/:id/:type', (req: Request, res: Response): void => {

    //
    const type = req.params.type as string ;

    if( ! /^(json|txt)$/i.test(type) ){
        res.status(415).end();
        return ;
    }

    // Récupération du paramètre d'url "id".
    // L'usage de la directive "as" est a éviter.
    // Voir l'exemple de Web-Service suivant
    // pour avoir la bonne façon de faire.
    const id = req.params.id as string;

    // Recherche et récupération du post demandé
    const post: IPost | undefined = getPost(id);

    // Création d'un indicateur booléan pour éviter 
    // de réévaluer constamment la même expression
    const postFound: boolean = post !== undefined ;
    
    let responsePost: IPost | string | undefined = undefined;

    if( postFound ){
        switch( type.toLowerCase() ){
            
            case 'json':
                responsePost = post;
            break;

            case 'txt':
                responsePost = Object.entries(post || {}).reduce( (acc, [key, value]) => {
                    return `${acc}\n${key}: ${value}`;
                }, ``);
            break ;

            default : 
                res.status(415).end();
                return ;
        }
    }

    // Usage des ternaires pour connaitre à la fois le bon 
    // code de status mais aussi pour les données de retour.
    // Usage de la destructuration pour la réponse.

    res
        .status(postFound ? 200 : 404)
        .send(
            postFound ? responsePost : {
                message: `Unknown post (${id}) !`
            }
        );
});

// Bonne façon de faire pour la définition des types d'un web-service sous express.js en typescript
// |
// v
type ReqDictionary = {}
type ReqBody  = void;
type ReqQuery = { last_id?: string }
type ResBody  = IPost[];

// On définit notre custom handler qui n'est ni plus ni moins qu'un type Request personnalisé
type CustomPostsHandlerRequest = Request<ReqDictionary, ResBody, ReqBody, ReqQuery>

// Web service pour la récupération des posts d'un fils d'actualité par pagination.
// On utilise notre custom handler ici __
//                                       |
//                                       |
//                                       v
app.get('/posts', (req: CustomPostsHandlerRequest, res: Response): void => {
    try {
        // Récupération dans la query du dernier id communiqué au front.
        // Avec le custom handler on a plus besoin d'utiliser la directive "as"
        const last_id: string | undefined = req.query.last_id;

        // queries -> Après le point d'interrogation.
        // http://www.google.fr/maPage/id/json?maVariable=maValeur&

        // On spécifie le code HTTP 200 et on retourne le contenu demandé.
        res.status(200).send(getPosts(last_id, 3));
    }
    catch (e){
        // En cas d'erreur on évite de renvoyer le message d'erreur,
        // on se contente d'envoyer le code d'erreur 500 (erreur interne)
        res.status(500).end();
    }
});

// 
app.delete('/posts/:post_id', (req: Request, res: Response): void => {
    try {
        const postId: string = req.query.id as string;
        deletePost(postId);
        res.end();
    }
    catch( e ){
        res.status(500).end();
    }
});

app.put('/posts', (req: Request, res: Response): void => {
    try {

        // TODO Creation

        res.status(201).json({
            postId: `le post id créé`
        });
    } catch (e){
        res.status(500).end();
    }
});

app.put('/posts/:post_id', (req: Request, res: Response): void => {
    try {
        const postId: string = req.query.id as string;

        // todo update

        res.status(200).json({
            // Le nouveau contenu du post
        });
    } catch( e ){
        res.status(500).end();
    }
});

// Start the server
const PORT: number = 1337;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
