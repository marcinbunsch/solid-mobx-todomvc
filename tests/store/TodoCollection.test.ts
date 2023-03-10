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

  describe("#getFilteredItems", function () {
    it("returns all items when filter is 'all'", function () {
      const todos = new TodoCollection()
      todos.add("Buy milk")
      todos.add("Buy eggs")
      todos.add("Buy bread")

      assert.equal(todos.getFilteredItems("all").length, 3)
    })

    it("returns only active items when filter is 'active'", function () {
      const todos = new TodoCollection()
      const first = todos.add("Buy milk")
      todos.add("Buy eggs")
      todos.add("Buy bread")

      first.toggleCompleted()

      assert.equal(todos.getFilteredItems("active").length, 2)
    })

    it("returns only completed items when filter is 'completed'", function () {
      const todos = new TodoCollection()
      const first = todos.add("Buy milk")
      todos.add("Buy eggs")
      todos.add("Buy bread")

      first.toggleCompleted()

      assert.equal(todos.getFilteredItems("completed").length, 1)
    })
  })
})
