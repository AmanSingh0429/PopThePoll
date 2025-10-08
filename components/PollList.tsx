import { useEffect, useState } from "react"
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
  TrendingUp,
  Pause,
  Play,
  Copy,
  Check,
  Loader2
} from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface PollOption {
  id: string
  text: string
  pollId: string
}

interface Votes {
  id: string
  voterId: string
  optionId: string
  pollId: string
  createdAt: string
}

interface Poll {
  id: string
  title: string
  active: boolean
  createdAt: string
  options: PollOption[]
  votes: Votes[]
}

const PollList = () => {
  const router = useRouter()
  const [polls, setPolls] = useState<Poll[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [sortBy, setSortBy] = useState<"newest" | "votes" | "title">("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pollToDelete, setPollToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedPollId, setCopiedPollId] = useState<string | null>(null)
  const [togglingPolls, setTogglingPolls] = useState<Set<string>>(new Set())

  const pollsPerPage = 10

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get("http://localhost:8000/poll")
        console.log(response.data)
        setPolls(response.data)
      } catch (error) {
        console.error("Failed to fetch polls:", error)
        setError("Failed to load polls. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [])

  const getTopOption = (poll: Poll) => {
    const totalVotes = poll.votes.length
    const voteCounts: { [key: string]: number } = {}
    const votes = poll.votes

    votes.forEach(vote => {
      const optionId = vote.optionId
      voteCounts[optionId] = (voteCounts[optionId] || 0) + 1
    })

    let mostVotedOptionId = null
    let maxVotes = 0

    for (const optionId in voteCounts) {
      if (voteCounts[optionId] > maxVotes) {
        maxVotes = voteCounts[optionId]
        mostVotedOptionId = optionId
      }
    }

    let mostVotedOptionText = 'No votes yet'
    if (mostVotedOptionId !== null) {
      const mostVotedOption = poll.options.find(
        option => String(option.id) === String(mostVotedOptionId)
      )
      if (mostVotedOption) {
        mostVotedOptionText = mostVotedOption.text
      }
    }

    return {
      totalVotes,
      mostVotedOptionText,
      optionId: mostVotedOptionId,
      votes: maxVotes
    }
  }

  const handleViewPoll = (pollId: string) => {
    router.push(`poll/${pollId}`)
  }

  const handleDeleteClick = (pollId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setPollToDelete(pollId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pollToDelete) return

    try {
      setIsDeleting(true)
      await axios.delete(`http://localhost:8000/poll/${pollToDelete}`)
      setPolls(polls.filter(poll => poll.id !== pollToDelete))
      setDeleteDialogOpen(false)
      setPollToDelete(null)

      if (filteredPolls.length <= pollsPerPage && currentPage > 1) {
        setCurrentPage(1)
      }
    } catch (error) {
      console.error("Failed to delete poll:", error)
      setError("Failed to delete poll. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const copyPollLink = async (pollId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const pollUrl = `http://localhost:3000/${pollId}`

    try {
      await navigator.clipboard.writeText(pollUrl)
      setCopiedPollId(pollId)
      setTimeout(() => setCopiedPollId(null), 2000)
    } catch (err) {
      console.error('Failed to copy poll link:', err)
    }
  }

  // Filter and search logic
  const filteredPolls = polls
    .filter(poll => {
      const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && poll.active) ||
        (statusFilter === "inactive" && !poll.active)

      return matchesSearch && matchesStatus
    })
  // .sort((a, b) => {
  //   if (sortBy === "newest") {
  //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //   } else if (sortBy === "votes") {
  //     return b.totalVotes - a.totalVotes
  //   } else {
  //     return a.title.localeCompare(b.title)
  //   }
  // })

  // Pagination logic
  const indexOfLastPoll = currentPage * pollsPerPage
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage
  const currentPolls = filteredPolls.slice(indexOfFirstPoll, indexOfLastPoll)
  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage)

  const getVotePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleTogglePoll = async (pollId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      setTogglingPolls(prev => new Set(prev).add(pollId))
      const response = await axios.patch(`http://localhost:8000/poll/${pollId}/toggle`)

      setPolls(polls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            active: !poll.active
          }
        }
        return poll
      }))
    } catch (error) {
      console.error("Failed to toggle poll:", error)
      setError("Failed to update poll status. Please try again.")
    } finally {
      setTogglingPolls(prev => {
        const newSet = new Set(prev)
        newSet.delete(pollId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading polls...</p>
        </div>
      </div>
    )
  }

  if (error && polls.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-2 h-auto p-1"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Search and Filter Bar */}
      {/* <Card className="shadow-sm border-0 bg-white py-3">
        <CardContent className="px-4">
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
      </Card> */}

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
          const leadingOption = getTopOption(poll)
          const isToggling = togglingPolls.has(poll.id)

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
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {poll.title}
                          </h3>
                          <Badge
                            variant={poll.active ? "default" : "secondary"}
                            className="shrink-0 text-xs"
                          >
                            {poll.active ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              http://localhost:3000/{poll.id}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => copyPollLink(poll.id, e)}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              {copiedPollId === poll.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Poll Link */}


                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            {poll.options.length} options
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {poll.votes.length} vote(s)
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
                              {getVotePercentage(leadingOption.votes, leadingOption.totalVotes)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${getVotePercentage(leadingOption.votes, leadingOption.totalVotes)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 truncate mr-2">{leadingOption.mostVotedOptionText}</span>
                            <span className="text-xs font-medium shrink-0">{leadingOption.votes} vote(s)</span>
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
                      className="h-8 px-3 text-xs w-full"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleDeleteClick(poll.id, e)}
                      disabled={isDeleting && pollToDelete === poll.id}
                      className="h-8 px-3 text-xs w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      {isDeleting && pollToDelete === poll.id ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Delete
                    </Button>
                    <Button
                      variant={poll.active ? "destructive" : "default"}
                      size="sm"
                      onClick={(e) => handleTogglePoll(poll.id, e)}
                      disabled={isToggling}
                      className="h-8 px-3 text-xs w-full"
                    >
                      {isToggling ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : poll.active ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
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
                {polls.length === 0 ? "No polls created yet" : "No polls found matching your criteria"}
              </div>
              {polls.length === 0 ? (
                <Button
                  onClick={() => router.push('/create-poll')}
                >
                  Create Your First Poll
                </Button>
              ) : (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Poll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this poll? This action cannot be undone and all votes will be permanently lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Poll"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bottom Pagination Info */}
      {/* {totalPages > 1 && (
        <div className="flex justify-center items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <span>
            Showing {indexOfFirstPoll + 1}-{Math.min(indexOfLastPoll, filteredPolls.length)} of{" "}
            {filteredPolls.length} polls
          </span>
        </div>
      )} */}
    </div>
  )
}

export default PollList