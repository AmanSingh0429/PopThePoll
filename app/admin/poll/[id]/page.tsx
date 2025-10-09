"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, ArrowLeft, Users, BarChart3, PieChart, Search, ChevronLeft, ChevronRight, CloudFog } from "lucide-react"
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
import axios, { all } from "axios"

interface Votes {
  id: string,
  voterId: string,
  optionId: string,
  pollId: string,
  createdAt: string,
  voter: {
    id: string,
    name: string
    email: string
    verified: boolean
    createdAt: string
  },
  option: {
    id: string,
    text: string,
    pollId: string
  }
}

interface PollOption {
  id: string
  text: string
  pollId: string
  votes: Votes[]
}
interface Poll {
  id: string
  title: string
  options: PollOption[]
  active: boolean
}

// const mockPolls: Poll[] = [
//   {
//     id: "1",
//     title: "What is your favorite programming language?",
//     options: [
//       { id: "js", text: "JavaScript", votes: 45 },
//       { id: "py", text: "Python", votes: 32 },
//       { id: "ts", text: "TypeScript", votes: 28 },
//       { id: "go", text: "Go", votes: 15 },
//     ],
//     totalVotes: 120,
//     isActive: true,
//   },
//   {
//     id: "2",
//     title: "Which framework do you prefer for web development?",
//     options: [
//       { id: "react", text: "React", votes: 67 },
//       { id: "vue", text: "Vue.js", votes: 23 },
//       { id: "angular", text: "Angular", votes: 18 },
//       { id: "svelte", text: "Svelte", votes: 10 },
//       { id: "next", text: "Next.js", votes: 2 },
//     ],
//     totalVotes: 120,
//     isActive: true,
//   },
// ]

// const mockVoters: Voter[] = [
//   { id: "1", name: "John Doe", email: "john@example.com", vote: "JavaScript", votedAt: "2024-01-15 10:30" },
//   { id: "2", name: "Jane Smith", email: "jane@example.com", vote: "Python", votedAt: "2024-01-15 11:15" },
//   { id: "3", name: "Mike Johnson", email: "mike@example.com", vote: "TypeScript", votedAt: "2024-01-15 12:00" },
//   { id: "4", name: "Sarah Wilson", email: "sarah@example.com", vote: "JavaScript", votedAt: "2024-01-15 14:20" },
//   { id: "5", name: "Tom Brown", email: "tom@example.com", vote: "Go", votedAt: "2024-01-15 15:45" },
//   { id: "6", name: "Alice Johnson", email: "alice@example.com", vote: "JavaScript", votedAt: "2024-01-15 16:30" },
//   { id: "7", name: "Bob Williams", email: "bob@example.com", vote: "Python", votedAt: "2024-01-15 17:15" },
//   { id: "8", name: "Carol Davis", email: "carol@example.com", vote: "TypeScript", votedAt: "2024-01-16 09:00" },
//   { id: "9", name: "David Miller", email: "david@example.com", vote: "JavaScript", votedAt: "2024-01-16 10:30" },
//   { id: "10", name: "Eva Garcia", email: "eva@example.com", vote: "Go", votedAt: "2024-01-16 11:45" },
//   { id: "11", name: "Frank Wilson", email: "frank@example.com", vote: "Python", votedAt: "2024-01-16 14:20" },
//   { id: "12", name: "Grace Brown", email: "grace@example.com", vote: "JavaScript", votedAt: "2024-01-16 15:30" },
// ]

const PollAnalytics = ({ params }: { params: { id: string } }) => {

  const pollId = params.id
  const router = useRouter()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [allVoters, setAllVoters] = useState<Votes[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [voteFilter, setVoteFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const votersPerPage = 100

  useEffect(() => {
    const session = sessionStorage.getItem("auth")
    if (!session) {
      router.push("/login")
    }
  }, [])

  useEffect(() => {
    const getPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/poll/${pollId}`)
        console.log("poll", response.data)
        setPoll(response.data)
      } catch (error) {
        console.log(error)
      }
    };

    const getVoters = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/votes/poll/11`)
        console.log("voters", response.data)
        setAllVoters(response.data)
      } catch (error) {
        console.log(error)
      }
    };

    getPoll();
    getVoters();

  }, [])


  // useEffect(() => {
  //   const foundPoll = mockPolls.find(p => p.id === pollId)
  //   setPoll(foundPoll || null)

  //   // Filter voters based on the poll options
  //   if (foundPoll) {
  //     const pollOptions = foundPoll.options.map(opt => opt.text)
  //     const filteredVoters = mockVoters.filter(voter => pollOptions.includes(voter.vote))
  //     setAllVoters(filteredVoters)
  //   }
  // }, [pollId])

  const handleDeletePoll = async () => {
    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`http://localhost:8000/poll/${pollId}`)
        if (response.status === 200) {
          router.push("/admin/poll")
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDeleteVote = async (voterId: string) => {
    if (window.confirm("Are you sure you want to delete this vote?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/votes/${voterId}`)
        if (response.status === 200) {
          setAllVoters(allVoters.filter(voter => voter.id !== voterId))
          setCurrentPage(1)
        }
      } catch (error) {
        console.log(error)
      }

    }
  }


  // Filter voters based on search and vote filter
  // const filteredVoters = allVoters.filter(voter => {
  //   const matchesSearch =
  //     voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     voter.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesVote = voteFilter === "all" || voter.vote === voteFilter

  //   return matchesSearch && matchesVote
  // })

  // Pagination logic
  // const indexOfLastVoter = currentPage * votersPerPage
  // const indexOfFirstVoter = indexOfLastVoter - votersPerPage
  // const currentVoters = filteredVoters.slice(indexOfFirstVoter, indexOfLastVoter)
  // const totalPages = Math.ceil(filteredVoters.length / votersPerPage)

  // Get unique vote options for filter dropdown
  const voteOptions = poll ? [...new Set(poll.options.map(opt => opt.text))] : []

  if (!poll) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Poll not found</h2>
          <Button onClick={() => router.push("/admin/poll")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Polls
          </Button>
        </div>
      </div>
    )
  }

  const chartData = poll.options.map((option, index) => ({
    name: option.text,
    votes: option.votes.length,
    percentage: Math.round((option.votes.length / allVoters.length) * 100),
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const pieData = poll.options.map((option, index) => ({
    name: option.text,
    value: option.votes.length,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }))

  const COLORS = pieData.map(item => item.color)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/poll")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{poll.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={poll.active ? "default" : "secondary"}>
                {poll.active ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {allVoters.length} votes • {poll.options.length} options
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allVoters.length}</div>
            <p className="text-xs text-muted-foreground">
              {allVoters.length} unique voters
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
                <Bar dataKey="votes" fill="#8884d8" />
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
            Voters List ({allVoters.length} voters)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          {/* <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search voters by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>
            <select
              value={voteFilter}
              onChange={(e) => {
                setVoteFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 py-2 border rounded-md text-sm bg-background min-w-32"
            >
              <option value="all">All Votes</option>
              {voteOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div> */}

          {/* Voters Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vote</TableHead>
                  <TableHead>Voted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allVoters.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.voter.name}</TableCell>
                    <TableCell className="text-sm">{entry.voter.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.option.text}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{entry.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVote(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* {currentVoters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {filteredVoters.length === 0 ? "No voters found matching your criteria." : "No voters on this page."}
              </div>
            )} */}
          </div>

          {/* Pagination */}
          {/* {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstVoter + 1}-{Math.min(indexOfLastVoter, filteredVoters.length)} of{" "}
                {filteredVoters.length} voters
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="text-sm text-gray-600 mx-2">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )} */}

          {/* Pagination for smaller screens */}
          {/* {totalPages > 1 && (
            <div className="flex flex-col sm:hidden items-center gap-2">
              <div className="text-sm text-muted-foreground text-center">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  )
}

export default PollAnalytics