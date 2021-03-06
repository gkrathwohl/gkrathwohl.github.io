const {
  colors,
  CssBaseline,
  ThemeProvider,
  Typography,
  Button,
  InputBase,
  Card,
  CardContent,
  Checkbox,
  Container,
  makeStyles,
  createMuiTheme,
  Box,
  SvgIcon,
  Link,
} = MaterialUI;

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: colors.red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

function LightBulbIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
    </SvgIcon>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(6, 0, 3),
  },
  lightBulb: {
    verticalAlign: 'middle',
    marginRight: theme.spacing(1),
  },
}));

function ProTip() {
  const classes = useStyles();
  return (
    <Typography className={classes.root} color="textSecondary">
      <LightBulbIcon className={classes.lightBulb} />
      Please do not "hack" Greg's todo list. Greg has a lot to do.
    </Typography>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Greg's Todos
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

class ClearTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  mouseEnter = () => {
    this.setState({hover: true})
  }

  mouseLeave = () => {
    this.setState({hover: false})
  }

  render() {
    let style = { color: this.state.hover ? "black" : "rgb(224, 224, 224)" }

    return(
      <div 
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        onClick={this.props.onClick}
        style={ { float: 'right', marginRight: '10px', marginTop: '7px' } }
      >
        <SvgIcon
          style={style}
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </SvgIcon>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: props.todos,
      newTodoValue: ""
    };
  }

  toggleChecked = (key, complete) => {
    fetch("https://kylyqv8v1g.execute-api.us-east-1.amazonaws.com/todos", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: key,
        complete: complete
      }),
    })

    this.setState({
      todos: this.state.todos.map((el) => (el.key === key ? { key: key, created_at: el.created_at, task: el.task, complete: !el.complete} : el))
    });
  }

  addTodo = () => {
    fetch("https://kylyqv8v1g.execute-api.us-east-1.amazonaws.com/todos", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: this.state.newTodoValue
      }),
    }).then(response => response.json())
    .then(newTodo => {
      this.setState({
        todos: [newTodo].concat(this.state.todos),
        newTodoValue: ""
      });
    });
  }

  newTodohandleChange = (event) => {
    this.setState({
      newTodoValue: event.target.value
    });
  }

  handleDelete = (key) => {
    fetch("https://kylyqv8v1g.execute-api.us-east-1.amazonaws.com/todos", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: key }),
    }).then(response => response.json())
    .then(newTodo => {
      this.setState({
        todos: this.state.todos.filter(todo => todo.key != key),
      });
    });
  }

  todos = () => {
    const ordered_todos = this.state.todos.sort((a,b) => {
      return a.created_at - b.created_at;
    });

    return ordered_todos.map((todo, index) =>
      <Card key={todo.key} id={todo.key} style={ { marginBottom: '8px' } } >
        <CardContent
          style={ { padding: '5px' } }
        >
          <div style={ { width: '10%', float: 'left' } }>
            <Checkbox
              onChange={() => this.toggleChecked(todo.key,!todo.complete)}
              value="checkedA"
              checked={todo.complete}
              id={todo.key}
            />
          </div>
          <Typography variant="body2" component="p" style={ { textDecoration: todo.complete ? "line-through" : '', lineHeight: '3', width: "70%", float: "left" } }>
            {todo.task}
          </Typography>
          <ClearTodo
            onClick={() => {this.handleDelete(todo.key)}}
          />
        </CardContent>
      </Card>
    );
  }

  showSave = () => (
    <div style={ { width: '10%', float: 'right', marginRight: '20px' } }>
      <Button
        color="secondary"
        size="small"
        style={ { marginTop: '4px', height: '100%' } }
        onClick={ this.addTodo }
      >
        Save
      </Button>
    </div>
  )

  newTodo = () => {
    return (
      <Card style={ { marginBottom: '8px' } } >
        <CardContent style={ { padding: '5px', paddingTop: '5px' } }>
          <div style={ { width: '10%', float: 'left' } }>
            <Checkbox
              value="checkedA"
              inputProps={{ 'aria-label': 'Checkbox A' }}
              disabled={true}
            />
          </div>
          <InputBase
            placeholder="Add Todo"
            style={ { paddingTop: "5px", fontSize: "0.875rem", width: "70%" } }
            value={this.state.newTodoValue}
            onChange={this.newTodohandleChange}
            onKeyDown={(event) => { if (event.key== 'Enter') { this.addTodo() } } }
          />
          {this.state.newTodoValue != "" ? this.showSave() : null}
        </CardContent>
      </Card>
    );
  }

  render() {
    return (
      <Container maxWidth="sm">
        <div style={{ marginTop: 24, }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Greg's Todos
          </Typography>

          <div>{this.todos()}</div>
          <div>{this.newTodo()}</div>

          <ProTip />
          <Copyright />
        </div>
      </Container>
    )
  };
}

fetch("https://kylyqv8v1g.execute-api.us-east-1.amazonaws.com/todos")
  .then(response => response.json())
  .then(todos => {
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App todos={todos} />
      </ThemeProvider>,
      document.querySelector('#root'),
    );
  });
