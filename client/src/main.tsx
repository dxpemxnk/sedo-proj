import { createRoot } from 'react-dom/client';
import { App } from './app/App/App';
// import './index.css';

createRoot(document.getElementById('root')!)
  .render(<App />);