import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Users,
  Search,
  Trash2,
  Calendar,
  List,
  BarChart3,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react"
import { useRouter } from "next/navigation"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  title: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  createdAt: string
}

const PollList = () => {
  const router = useRouter()
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
      createdAt: "2024-01-15"
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
      createdAt: "2024-01-10"
    },
    {
      id: "3",
      title: "What's your preferred database system?",
      options: [
        { id: "mysql", text: "MySQL", votes: 40 },
        { id: "postgres", text: "PostgreSQL", votes: 35 },
        { id: "mongodb", text: "MongoDB", votes: 25 },
        { id: "redis", text: "Redis", votes: 20 },
      ],
      totalVotes: 120,
      isActive: false,
      createdAt: "2024-01-05"
    },
    {
      id: "4",
      title: "Which cloud platform do you use most frequently?",
      options: [
        { id: "aws", text: "AWS", votes: 55 },
        { id: "azure", text: "Azure", votes: 35 },
        { id: "gcp", text: "Google Cloud", votes: 25 },
        { id: "digitalocean", text: "DigitalOcean", votes: 15 },
      ],
      totalVotes: 130,
      isActive: true,
      createdAt: "2024-01-20"
    },
    {
      id: "5",
      title: "What's your preferred code editor?",
      options: [
        { id: "vscode", text: "VS Code", votes: 80 },
        { id: "webstorm", text: "WebStorm", votes: 20 },
        { id: "sublime", text: "Sublime Text", votes: 15 },
        { id: "vim", text: "Vim", votes: 10 },
      ],
      totalVotes: 125,
      isActive: false,
      createdAt: "2024-01-03"
    },
    {
      id: "6",
      title: "Which mobile platform do you develop for?",
      options: [
        { id: "ios", text: "iOS", votes: 45 },
        { id: "android", text: "Android", votes: 40 },
        { id: "both", text: "Both", votes: 30 },
        { id: "other", text: "Other", votes: 15 },
      ],
      totalVotes: 130,
      isActive: true,
      createdAt: "2024-01-18"
    },
  ]

  const [polls, setPolls] = useState<Poll[]>(mockPolls)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "title">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const pollsPerPage = 4

  const handleViewPoll = (pollId: string) => {
    router.push(`poll/${pollId}`)
  }

  const handleDeletePoll = (pollId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (window.confirm("Are you sure you want to delete this poll? This action cannot be undone.")) {
      setPolls(polls.filter(poll => poll.id !== pollId))
      if (filteredPolls.length <= pollsPerPage && currentPage > 1) {
        setCurrentPage(1)
      }
    }
  }

  // Filter and search logic
  const filteredPolls = polls
    .filter(poll => {
      const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && poll.isActive) ||
        (statusFilter === "inactive" && !poll.isActive)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "votes") {
        return b.totalVotes - a.totalVotes
      } else {
        return a.title.localeCompare(b.title)
      }
    })

  // Pagination logic
  const indexOfLastPoll = currentPage * pollsPerPage
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage
  const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll)
  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage)

  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0)
  const activePolls = polls.filter(p => p.isActive).length

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  const getLeadingOption = (options: PollOption[]) => {
    return options.reduce((leading, option) =>
      option.votes > leading.votes ? option : leading
      , options[0])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Polls</p>
                <p className="text-2xl font-bold mt-1">{polls.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2 this week</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <List className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold mt-1">{totalVotes.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+150 today</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Polls</p>
                <p className="text-2xl font-bold mt-1">{activePolls}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((activePolls / polls.length) * 100)}% of total
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            <div className="flex-1 w-full lg:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search polls by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 h-10 text-sm"
              />
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border rounded-lg text-sm bg-background h-10 min-w-32"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border rounded-lg text-sm bg-background h-10 min-w-36"
              >
                <option value="newest">Newest First</option>
                <option value="votes">Most Votes</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Polls List Header with Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Polls</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredPolls.length} polls found
          </p>
        </div>

        {/* Pagination - Moved to top */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600 min-w-20 text-center">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Polls List */}
      <div className="space-y-3">
        {currentPolls.map((poll) => {
          const leadingOption = getLeadingOption(poll.options)
          return (
            <Card
              key={poll.id}
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 bg-white py-0"
              onClick={() => handleViewPoll(poll.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Poll Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg mt-1">
                        <List className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {poll.title}
                          </h3>
                          <Badge
                            variant={poll.isActive ? "default" : "secondary"}
                            className="shrink-0 text-xs"
                          >
                            {poll.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            {poll.options.length} options
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {poll.totalVotes} votes
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(poll.createdAt)}
                          </span>
                        </div>

                        {/* Leading Option */}
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Leading option</span>
                            <span className="text-sm font-semibold text-green-600">
                              {getVotePercentage(leadingOption.votes, poll.totalVotes)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${getVotePercentage(leadingOption.votes, poll.totalVotes)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 truncate mr-2">{leadingOption.text}</span>
                            <span className="text-xs font-medium shrink-0">{leadingOption.votes} votes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 shrink-0 lg:items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewPoll(poll.id)
                      }}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePoll(poll.id, e)
                      }}
                      className="h-8 px-3 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {currentPolls.length === 0 && (
          <Card className="border-0 text-center py-12">
            <CardContent>
              <div className="text-gray-500 text-base mb-3">
                No polls found matching your criteria
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setCurrentPage(1)
                }}
              >
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Pagination Info */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <span>
            Showing {indexOfFirstPoll + 1}-{Math.min(indexOfLastPoll, filteredPolls.length)} of{" "}
            {filteredPolls.length} polls
          </span>
        </div>
      )}
    </div>
  )
}

export default PollList