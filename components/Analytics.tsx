
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, BarChart3, Plus, Trash2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import PollList from "./PollList"

const Analytics = () => {
  const seperateReturn = true
  if (seperateReturn) {
    return <PollList />
  }
  const mockPolls = [
    {
      id: "1",
      title: "What is your favorite programming language?",
      options: [
        { id: "js", text: "JavaScript", votes: 45 },
        { id: "py", text: "Python", votes: 32 },
        { id: "ts", text: "TypeScript", votes: 28 },
        { id: "go", text: "Go", votes: 15 },
      ],
      totalVotes: 120,
      isActive: true,
    },
    {
      id: "2",
      title: "Which framework do you prefer for web development?",
      options: [
        { id: "react", text: "React", votes: 67 },
        { id: "vue", text: "Vue.js", votes: 23 },
        { id: "angular", text: "Angular", votes: 18 },
        { id: "svelte", text: "Svelte", votes: 12 },
      ],
      totalVotes: 120,
      isActive: true,
    },
  ]
  const [polls, setPolls] = useState(mockPolls)
  const chartData = polls.map((poll) => ({
    name: poll.title.length > 20 ? poll.title.substring(0, 20) + "..." : poll.title,
    votes: poll.totalVotes,
  }))
  const pieData = polls.map((poll, index) => ({
    name: poll.title.length > 15 ? poll.title.substring(0, 15) + "..." : poll.title,
    value: poll.totalVotes,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const timelineData = polls.map((poll, index) => ({
    poll: `Poll ${index + 1}`,
    votes: poll.totalVotes,
    active: poll.isActive ? 1 : 0,
  }))
  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{polls.length}</div>
              <p className="text-xs text-muted-foreground">
                {polls.filter((p) => p.isActive).length} active polls
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}</div>
              <p className="text-xs text-muted-foreground">
                Avg {Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length)} votes per
                poll
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{polls.filter((p) => p.isActive).length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((polls.filter((p) => p.isActive).length / polls.length) * 100)}% of total polls
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Votes per Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>


          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Poll Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="poll" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="votes"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Total Votes"
                  />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Active Status"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Analytics