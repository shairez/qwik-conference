export const App = component$(() => {
  useStyles$(styles);

  const todos = useStore<Todos>({
    filter: "all",
    items: [
      { completed: false, title: "Read Qwik docs" },
      { completed: false, title: "Build HelloWorld" },
      { completed: false, title: "Profit" },
    ],
  });
  useContextProvider(TODOS, todos);

  return (
    <section class="todoapp">
      <Header />
      <Body />
      <Footer />
    </section>
  );
});

import { component$, Host, useContext } from "@builder.io/qwik";
import { FILTERS, TODOS } from "../../state/state";
import { Item } from "../item/item";

export const Body = component$(() => {
  const todos = useContext(TODOS);
  return (
    <Host class="main">
      <ul class="todo-list">
        {todos.items.filter(FILTERS[todos.filter]).map((key) => (
          <Item item={key} />
        ))}
      </ul>
    </Host>
  );
});

import { component$, Host, useContext } from "@builder.io/qwik";
import { FILTERS, FilterStates, TODOS, Todos } from "../../state/state";

/**
 * Footer showing items remaining and filtering options
 *
 * It only rerenders if the todos count changes or filters are reset.
 */
export const Footer = component$(
  () => {
    /**
     * Example of lite-component (it will always be included with the parent component)
     */
    const todos = useContext(TODOS);

    function Filter({ filter }: { filter: FilterStates }) {
      const lMode = filter.toLowerCase();
      return (
        <li>
          <a
            class={{ selected: todos.filter == lMode }}
            onClick$={() => {
              todos.filter = filter;
            }}
          >
            {filter[0].toUpperCase() + filter.slice(1)}
          </a>
        </li>
      );
    }
    const remaining = todos.items.filter(FILTERS.active).length;
    return (
      <Host class="footer">
        {todos.items.length > 0 ? (
          <>
            <span class="todo-count">
              <strong>{remaining}</strong>
              {remaining == 1 ? " item" : " items"} left
            </span>
            <ul class="filters">
              {FilterStates.map((f) => (
                <Filter filter={f} />
              ))}
            </ul>
            {remaining > 0 ? (
              <button
                class="clear-completed"
                onClick$={() => {
                  todos.items = todos.items.filter(FILTERS.active);
                }}
              >
                Clear completed
              </button>
            ) : null}
          </>
        ) : null}
      </Host>
    );
  },
  {
    tagName: "footer",
  }
);

import {
  component$,
  useContext,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { TODOS, Todos } from "../../state/state";

/**
 * Header component which is responsible for providing UI to ender new todo item.
 *
 * This component only rerenders if the user interacts with it through the input.
 */
export const Header = component$(
  () => {
    const state = useStore({ text: "" });
    const todos = useContext(TODOS);
    return (
      <>
        <h1>todos</h1>
        <input
          class="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={state.text}
          onKeyup$={(event: any) => {
            const inputValue = (event.target as HTMLInputElement).value;
            state.text = inputValue;
            if (event.key === "Enter" && inputValue) {
              todos.items.push({
                completed: false,
                title: state.text,
              });
              state.text = "";
            }
          }}
        />
      </>
    );
  },
  {
    tagName: "header",
  }
);
