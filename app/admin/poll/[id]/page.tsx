"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, ArrowLeft, Users, BarChart3, PieChart } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useRouter } from "next/navigation"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Voter {
  id: string
  name: string
  email: string
  vote: string
  votedAt: string
}

interface Poll {
  id: string
  title: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
}

const mockPolls: Poll[] = [
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
      { id: "svelte", text: "Svelte", votes: 10 },
      { id: "next", text: "Next.js", votes: 2 },
    ],
    totalVotes: 120,
    isActive: true,
  },
]

const mockVoters: Voter[] = [
  { id: "1", name: "John Doe", email: "john@example.com", vote: "JavaScript", votedAt: "2024-01-15 10:30" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", vote: "Python", votedAt: "2024-01-15 11:15" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", vote: "TypeScript", votedAt: "2024-01-15 12:00" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", vote: "JavaScript", votedAt: "2024-01-15 14:20" },
  { id: "5", name: "Tom Brown", email: "tom@example.com", vote: "Go", votedAt: "2024-01-15 15:45" },
]

const PollAnalytics = ({ params }: { params: { id: string } }) => {
  const pollId = params.id
  const router = useRouter()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [voters, setVoters] = useState<Voter[]>([])

  useEffect(() => {
    const foundPoll = mockPolls.find(p => p.id === pollId)
    setPoll(foundPoll || null)

    // Filter voters based on the poll options
    if (foundPoll) {
      const pollOptions = foundPoll.options.map(opt => opt.text)
      const filteredVoters = mockVoters.filter(voter => pollOptions.includes(voter.vote))
      setVoters(filteredVoters)
    }
  }, [pollId])

  const handleDeletePoll = () => {
    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      // In a real app, you would make an API call here
      console.log("Deleting poll:", pollId)
      router.push("/analytics")
    }
  }

  if (!poll) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Poll not found</h2>
          <Button onClick={() => router.push("/analytics")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Polls
          </Button>
        </div>
      </div>
    )
  }

  const chartData = poll.options.map((option, index) => ({
    name: option.text,
    votes: option.votes,
    percentage: Math.round((option.votes / poll.totalVotes) * 100),
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const pieData = poll.options.map((option, index) => ({
    name: option.text,
    value: option.votes,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const COLORS = pieData.map(item => item.color)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/analytics")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{poll.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={poll.isActive ? "default" : "secondary"}>
                {poll.isActive ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {poll.totalVotes} votes • {poll.options.length} options
              </span>
            </div>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDeletePoll}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Poll
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poll.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              {voters.length} unique voters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Options</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{poll.options.length}</div>
            <p className="text-xs text-muted-foreground">
              Multiple choice poll
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((poll.totalVotes / 150) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Based on 150 potential voters
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Votes Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${value} votes`, 'Votes']}
                  labelFormatter={(label) => `Option: ${label}`}
                />
                <Bar dataKey="votes" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Votes Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Voters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Voters List ({voters.length} voters)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vote</TableHead>
                <TableHead>Voted At</TableHead>
                <TableHead>Delete Vote</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {voters.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell className="font-medium">{voter.name}</TableCell>
                  <TableCell>{voter.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{voter.vote}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{voter.votedAt}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {voters.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No voters found for this poll.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PollAnalytics