import { useSearchParams } from "@solidjs/router"
import { createSignal, For, onMount, Show } from "solid-js"
import TodoCollection from "../stores/collections/TodoCollection"
import Todo from "../stores/models/Todo"

const setFocus = (el: HTMLElement) => setTimeout(() => el.focus())

function TodoItem(props: { todo: Todo }) {
  const [isEditing, setIsEditing] = createSignal(false)
  return (
    // this is only here so I don't have to type props.todo all the time
    <Show when={props.todo} keyed>
      {(todo) => {
        return (
          <li
            class="todo"
            classList={{
              editing: isEditing(),
              completed: todo.completed,
            }}
          >
            <div class="view">
              <input
                class="toggle"
                type="checkbox"
                checked={todo.completed}
                onInput={() => todo.toggleCompleted()}
              />
              <label onDblClick={() => setIsEditing(true)}>{todo.title}</label>
              <button class="destroy" onClick={() => todo.remove()} />
            </div>
            <Show when={isEditing()}>
              <input
                class="edit"
                value={todo.title}
                onFocusOut={(e) => {
                  todo.updateTitle(e.currentTarget.value)
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    todo.updateTitle(e.currentTarget.value)
                    setIsEditing(false)
                  } else if (e.key === "Escape") setIsEditing(false)
                }}
                ref={setFocus}
              />
            </Show>
          </li>
        )
      }}
    </Show>
  )
}

type ShowMode = "all" | "active" | "completed"

export default function TodosPage() {
  // intialize the store - for this example we initialize it here
  // but you could also initialize it in a store provider and have
  // it available to the entire app
  const todos = new TodoCollection()

  // Make the show mode query param driven
  const [searchParams, setSearchParams] = useSearchParams<{ mode: ShowMode }>()
  const changeShowMode = (mode: "all" | "active" | "completed" | undefined) => {
    setSearchParams({ mode })
  }

  onMount(() => {
    todos.load()
  })

  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              todos.add(e.currentTarget.value)
              e.currentTarget.value = ""
            }
          }}
        />
      </header>
      <Show when={todos.items.length > 0}>
        <section class="main">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            checked={todos.allCompleted}
            onInput={(e) => todos.toggleAll(e.currentTarget.checked)}
          />
          <label for="toggle-all" />
          <ul class="todo-list">
            {/* 
              glue the params coming from the query string and a collection together 
              both are reactive and will update the view when they change
            */}
            <For each={todos.getFilteredItems(searchParams.mode)}>
              {(todo) => <TodoItem todo={todo} />}
            </For>
          </ul>
        </section>
        <footer class="footer">
          <span class="todo-count">
            <strong>{todos.remainingCount}</strong>{" "}
            {todos.remainingCount === 1 ? " item " : " items "} left
          </span>
          <ul class="filters">
            <li>
              <a
                class="cursor-pointer"
                onClick={() => changeShowMode("all")}
                classList={{
                  selected: searchParams.mode === "all" || !searchParams.mode,
                }}
              >
                All
              </a>
            </li>
            <li>
              <a
                class="cursor-pointer"
                onClick={() => changeShowMode("active")}
                classList={{ selected: searchParams.mode === "active" }}
              >
                Active
              </a>
            </li>
            <li>
              <a
                class="cursor-pointer"
                onClick={() => changeShowMode("completed")}
                classList={{ selected: searchParams.mode === "completed" }}
              >
                Completed
              </a>
            </li>
          </ul>
          <Show when={todos.atLeastOneCompleted}>
            <button
              class="clear-completed"
              onClick={() => todos.clearCompleted()}
            >
              Clear completed
            </button>
          </Show>
        </footer>
      </Show>
    </section>
  )
}
