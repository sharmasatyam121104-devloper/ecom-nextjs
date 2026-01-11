export interface UserInterface {
  _id: string
  fullname: string
  email: string
  image? :string
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
}
