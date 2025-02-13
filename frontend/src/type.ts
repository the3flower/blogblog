export interface Blog {
  _id: string;
  blogTitle: string;
  blogDescription: string;
  blogAuthor: BlogAuthor; // object
  blogCreatedAt: Date;
  blogContent: object[]; //list of objects
  blogPublished: boolean;
}

export interface BlogAuthor {
  _id: "string";
  firstName: "string";
  lastName: "string";
  email: "string";
}

export interface UserDetails {
  _id: "string";
  firstName?: string;
  lastName?: string;
}
export interface BlogsList {
  blogs: Blog[];
}
