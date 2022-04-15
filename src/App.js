import logo from './logo.svg';
import './App.css';

let data = [
  {
    //data from past month
    category: 'Basic',
    value: 400,
    growth: 10,
    sign: '↑',
    color: '#008800',
    //subdata contains the data for breakdown of customer distribution flow
    subData: [
      {
        category: 'Elite',
        value: '100',
        growth: -10,
        sign: '↓',
        color: '#FF0000',
      },
      {
        category: 'Basic',
        value: '130',
        growth: -10,
        sign: '↓',
        color: '#FF0000',
      },
      {
        category: 'Royal',
        value: '300',
        growth: 13,
        sign: '↑',
        color: '#FF0000',
      },
    ],
  },
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
