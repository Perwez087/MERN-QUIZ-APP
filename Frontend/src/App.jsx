import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import LoggedInRoutes from "./components/LoggedInRoutes"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import QuizResults from "./pages/QuizResult"
import AttemptQuiz from "./pages/AttemptQuiz"
import Profile from "./pages/Profile"
import DashboardLayout from "./components/DashboardLayout"
import History from "./pages/History"
import CreateQuiz from "./pages/CreateQuiz"
import CreateQuestions from "./pages/CreateQuestions"
import AdminQuizes from "./pages/AdminQuizes"
import { useSelector } from "react-redux"
import DetailedResults from "./pages/DetailedResults"

function App() {

  const { user } = useSelector(state => state.auth)

  return (
    <div className=" bg-slate-950 text-white">
      <div className="max-w-[1200px] px-3 mx-auto min-h-screen ">
        <Routes>
          <Route path="/" element={<LoggedInRoutes><Home /></LoggedInRoutes>} />
          <Route path="/quiz/:id" element={<LoggedInRoutes><AttemptQuiz /></LoggedInRoutes>} />
          <Route path="/quiz-results" element={<LoggedInRoutes><QuizResults /></LoggedInRoutes>} />
          <Route path="/detailed-results" element={<LoggedInRoutes><DetailedResults /></LoggedInRoutes>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard">
            <Route index element={<LoggedInRoutes><DashboardLayout><Profile /></DashboardLayout></LoggedInRoutes>} />
            <Route path="history" element={<LoggedInRoutes><DashboardLayout><History /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="create-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuestions /></DashboardLayout ></LoggedInRoutes>} />
            <Route path="quizes" element={<LoggedInRoutes><DashboardLayout><AdminQuizes /></DashboardLayout></LoggedInRoutes>} />
            <Route path="edit-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout></LoggedInRoutes>} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App