import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.jsx'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <TooltipProvider delayDuration={200}>
        <App />
      </TooltipProvider>
    </Provider>
  </StrictMode>,
)
