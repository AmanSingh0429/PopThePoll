
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Trash2 } from "lucide-react"
import { useState } from "react"

const ActivePolls = () => {
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
      isActive: false,
    },
  ]
  const [polls, setPolls] = useState(mockPolls)

  const deletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId))
  }
  return (
    <>
      {polls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">{poll.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {poll.totalVotes} votes
                </Badge>
                <Badge variant={poll.isActive ? "default" : "secondary"} className={`${poll.isActive ? "bg-green-500" : "bg-purple-200"}`}>
                  {poll.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={poll.isActive ? "secondary" : "outline"}>{poll.isActive ? "Deactivate Poll" : "Activate Poll"}</Button>
              <Button variant="destructive" size="sm" onClick={() => deletePoll(poll.id)} >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{option.text}</span>
                      <span className="text-muted-foreground">
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default ActivePolls