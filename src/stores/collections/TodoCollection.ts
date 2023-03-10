import { action, computed, makeObservable, observable } from "mobx"
import Todo from "../models/Todo"

const LOCAL_STORAGE_KEY = "todos-solid-mobx"

export default class TodoCollection {
  items: Todo[] = []
  savingDisabled = false

  constructor() {
    makeObservable(this, {
      savingDisabled: observable,
      items: observable,
      allCompleted: computed,
      remainingCount: computed,
      clearCompleted: action,
      toggleAll: action,
      load: action,
    })
  }

  get remainingCount() {
    return this.items.filter((todo) => !todo.completed).length
  }

  get allCompleted() {
    return this.items.length > 0 && this.items.every((todo) => todo.completed)
  }

  get atLeastOneCompleted() {
    return this.items.some((todo) => todo.completed)
  }

  getFilteredItems(filter: "all" | "active" | "completed" | undefined) {
    switch (filter) {
      case undefined:
      case "all":
        return this.items
      case "active":
        return this.items.filter((todo) => !todo.completed)
      case "completed":
        return this.items.filter((todo) => todo.completed)
    }
  }

  toggleAll(completed: boolean) {
    this.batch(() =>
      this.items.forEach((todo) => todo.toggleCompleted(completed))
    )
  }

  add(title: string) {
    this.items.push(new Todo(this, { title }))
    this.save()
  }

  remove(id: string) {
    this.items = this.items.filter((todo) => todo.id !== id)
    this.save()
  }

  load() {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      const storage = JSON.parse(stored) as {
        items: { title: string; id?: string; completed: boolean }[]
      }
      this.items = storage.items.map((item) => new Todo(this, item))
    }
  }

  save() {
    if (this.savingDisabled) return

    const storage = {
      items: this.items.map((item) => ({
        id: item.id,
        title: item.title,
        completed: item.completed,
      })),
    }
    console.log("Saving", storage)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storage))
  }

  clearCompleted() {
    this.items = this.items.filter((todo) => !todo.completed)
    this.save()
  }

  batch(fn: () => void) {
    this.savingDisabled = true
    fn()
    this.savingDisabled = false
    this.save()
  }
}
