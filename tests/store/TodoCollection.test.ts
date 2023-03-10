import { assert } from "chai"
import TodoCollection from "../../src/stores/collections/TodoCollection"

describe("TodoCollection", function () {
  this.beforeEach(function () {
    localStorage.clear()
  })

  describe("#initialize", function () {
    it("works", function () {
      const todos = new TodoCollection()
      assert.equal(todos.items.length, 0)
    })
  })

  describe("#add", function () {
    it("correctly adds an item", function () {
      const todos = new TodoCollection()
      const todo = todos.add("Buy milk")
      assert.equal(todo.title, "Buy milk")
      assert.equal(todos.items.length, 1)
    })
  })

  describe("#remove", function () {
    it("correctly adds an item", function () {
      const todos = new TodoCollection()
      const todo = todos.add("Buy milk")
      assert.equal(todos.items.length, 1)

      todos.remove(todo.id)

      assert.equal(todos.items.length, 0)
    })
  })
})
