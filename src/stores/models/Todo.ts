import { action, makeObservable, observable } from "mobx"
import { v4 as uuid } from "uuid"
import TodoCollection from "../collections/TodoCollection"

export default class Todo {
  id: string
  title: string
  completed = false
  collection: TodoCollection

  constructor(
    collection: TodoCollection,
    {
      id,
      title,
      completed,
    }: { id?: string; title: string; completed?: boolean }
  ) {
    makeObservable(this, {
      title: observable,
      completed: observable,
      toggleCompleted: action,
      updateTitle: action,
    })
    this.collection = collection
    this.id = id ?? uuid()
    this.title = title
    this.completed = completed ?? false
  }

  toggleCompleted = (newValue?: boolean) => {
    this.completed = newValue !== undefined ? newValue : !this.completed
    this.collection.save()
  }

  updateTitle = (title: string) => {
    if (title === this.title) return

    this.title = title
    this.collection.save()
  }

  remove = () => {
    this.collection.remove(this.id)
  }
}
