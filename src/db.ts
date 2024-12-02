import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export type TPhotos = string | string[];
export type TComments = string[]; 

export interface IPost {
    id: string;
    author: string;
    photos?: TPhotos;
    video?: string;
    comments: TComments;
    description: string;
    date: Date;
    likes: number;
    place: string;
    music: string;
}

function randomIntFromInterval(min: number, max: number): number { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let posts: IPost[] = [];

for(let i = 0 ; i < 30 ; ++i ){
    
    const post: IPost = {
        author: `${faker.person.fullName()}`,
        comments: Array(randomIntFromInterval(0,20)).fill(0).map( () => faker.string.sample(randomIntFromInterval(10,50))),
        date: new Date(),
        description: i + ' --> ' + faker.lorem.paragraph({
            min: 1,
            max: 2
        }),
        likes: randomIntFromInterval(0, 30),
        music: faker.music.album(),
        place: faker.location.streetAddress(),
        id: `JOFP${i}349F`
    };

    if(i%3 === 0){
        post.video = `video`;
    } else {
        if( i%10 === 0 ){
            post.photos = [`https://picsum.photos/200/300`,`https://picsum.photos/200/300`];
        } else {
            post.photos = `https://picsum.photos/200/300`;
        }
    }

    posts.push(post);
}

export function getPost(postId: string): IPost | undefined {
    console.log(posts);
    return posts.find( ({ id }) => id === postId );
}

export function getPosts(lastId?: string, postCount: number = 2): IPost[] {

    let startPos: number = !lastId ? 0 : posts.findIndex( ({ id }: IPost) => id === lastId) ;
    const postsResult: IPost[] = [];

    if(startPos === -1 || startPos + 1 >= posts.length){
        return postsResult;
    }

    const shift: number = startPos === 0 ? 0 : startPos + 1;
    postsResult.push( ...posts.slice( shift, shift + postCount ) );

    return postsResult.reduce( (acc: IPost[], { ...minPostInformations }) => [...acc, minPostInformations], []);
}

export function deletePost(post_id: string): void {
    posts = posts.filter( ({ id }) => id !== post_id );
}

// export function updatePost(

export default posts;