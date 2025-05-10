import { Sheet, SheetRootProps } from "@silk-hq/components";
import { LongSheet } from "./LongSheet";
import "./ExamplesSheet.css";

interface ExampleItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
}

const examples: ExampleItem[] = [
  {
    id: "music-library",
    title: "Music Library",
    description: "A sample music library with albums and artists",
    icon: "🎵",
    code: `musicLibrary = {
  albums: [
    {
      title: "Thriller",
      artist: "Michael Jackson",
      year: 1982,
      tracks: ["Wanna Be Startin' Somethin'", "Thriller", "Beat It"]
    },
    {
      title: "Abbey Road",
      artist: "The Beatles",
      year: 1969,
      tracks: ["Come Together", "Something", "Here Comes the Sun"]
    }
  ]
};
musicLibrary;`,
  },
  {
    id: "math-equations",
    title: "Math Equations",
    description: "Common mathematical functions",
    icon: "🔢",
    code: `myth = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
  power: (base, exponent) => Math.pow(base, exponent),
  squareRoot: (num) => Math.sqrt(num)
};
myth.squareRoot(4096);`,
  },
  {
    id: "submarine",
    title: "Submarine Class",
    description: "A class representing a submarine",
    icon: "🚢",
    code: `let Submarine;
if (!Submarine) {
  Submarine = class {
    constructor(name, maxDepth) {
      this.name = name;
      this.maxDepth = maxDepth;
      this.currentDepth = 0;
      this.isSubmerged = false;
    }

    dive(depth) {
      if (this.currentDepth + depth > this.maxDepth) {
        throw new Error('Cannot exceed maximum depth!');
      }
      this.currentDepth += depth;
      this.isSubmerged = true;
    }

    surface() {
      this.currentDepth = 0;
      this.isSubmerged = false;
    }
  }
}

nautilus = new Submarine('Nautilus', 1000);
nautilus.dive(500);
nautilus;`,
  },
  {
    id: "todo-list",
    title: "Todo List",
    description: "A simple todo list implementation",
    icon: "📝",
    code: `let TodoList;
if (!TodoList) {
    TodoList = class {
    constructor() {
        this.todos = [];
    }

    addTodo(text) {
        this.todos.push({
        id: Date.now(),
        text,
        completed: false
        });
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
        todo.completed = !todo.completed;
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
    }
    }
  }

myTodos = new TodoList();
myTodos.addTodo('Learn JavaScript');
myTodos.addTodo('Build something cool');
myTodos;`,
  },
  {
    id: "empty-function",
    title: "Empty Function",
    description: "To write code without making a global",
    icon: "⚡",
    code: `(() => {
  // Write here...
})();`,
  },
];

type SheetRootDivProps = Omit<SheetRootProps, "license" | "children"> &
  React.HTMLAttributes<HTMLDivElement>;

interface ExamplesSheetProps extends SheetRootDivProps {
  onClose: () => void;
  onExampleSelect: (code: string) => void;
  presentTrigger: React.ReactNode;
}

const ExamplesSheet = ({
  onClose,
  onExampleSelect,
  presentTrigger,
  className,
}: ExamplesSheetProps) => {
  const handleSelect = (code: string) => {
    onExampleSelect(code);
    onClose();
  };

  return (
    <LongSheet
      className={`ExampleLongSheet-content ${className}`}
      presentTrigger={presentTrigger}
      sheetContent={
        <div className="ExampleLongSheet-article">
          <Sheet.Trigger action="dismiss" asChild>
            <button className={`ExampleLongSheet-dismissTrigger`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ExampleLongSheet-dismissTriggerIcon`}
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </Sheet.Trigger>
          <div className="ExampleLongSheet-articleContent">
            <Sheet.Title className="ExampleLongSheet-title" asChild>
              <h1>Snippets</h1>
            </Sheet.Title>
            <h2 className="ExampleLongSheet-subtitle">
              Try any of these snippets to get started.
            </h2>

            <section className="ExampleLongSheet-articleBody">
              {examples.map((example) => (
                <Sheet.Trigger action="dismiss" asChild key={example.id}>
                  <button
                    className="ExampleCard-exampleItem"
                    onClick={() => handleSelect(example.code)}
                    aria-label={`Insert example: ${example.title}`}
                  >
                    <span className="ExampleCard-exampleIcon">
                      {example.icon}
                    </span>
                    <div className="ExampleCard-exampleContent">
                      <h4>{example.title}</h4>
                      <p>{example.description}</p>
                    </div>
                    <span className="ExampleCard-chevron" aria-hidden="true">
                      ›
                    </span>
                  </button>
                </Sheet.Trigger>
              ))}
            </section>
          </div>
        </div>
      }
    />
  );
};

export default ExamplesSheet;
