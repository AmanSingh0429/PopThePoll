"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users, BarChart3, Plus, Trash2 } from "lucide-react"
import AdminLogin from "@/components/AdminLogin"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

// Mock data for polls
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

type UserState = {
  name: string
  email: string
  hasVoted: boolean
  votedPolls: string[]
}

type PollStep = "info" | "otp" | "vote" | "results"

export default function PollingSystem() {

  const [currentStep, setCurrentStep] = useState<PollStep>("info")
  const [selectedPoll, setSelectedPoll] = useState(mockPolls[0])
  const [user, setUser] = useState<UserState>({
    name: "",
    email: "",
    hasVoted: false,
    votedPolls: [],
  })
  const [otp, setOtp] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [polls, setPolls] = useState(mockPolls)
  const [newPoll, setNewPoll] = useState({
    title: "",
    options: ["", ""],
  })
  const [admins, setAdmins] = useState([{ email: "admin@example.com", password: "password" }])
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" })

  const handleUserInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (user.name && user.email) {
      // Simulate OTP generation
      setCurrentStep("otp")
    }
  }

  const handleOtpVerification = () => {
    if (otp.length === 6) {
      setCurrentStep("vote")
    }
  }

  const handleVote = () => {
    if (selectedOption) {
      // Update poll votes
      const updatedPolls = polls.map((poll) => {
        if (poll.id === selectedPoll.id) {
          return {
            ...poll,
            options: poll.options.map((option) =>
              option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option,
            ),
            totalVotes: poll.totalVotes + 1,
          }
        }
        return poll
      })

      setPolls(updatedPolls)
      setSelectedPoll(updatedPolls.find((p) => p.id === selectedPoll.id)!)
      setUser((prev) => ({
        ...prev,
        hasVoted: true,
        votedPolls: [...prev.votedPolls, selectedPoll.id],
      }))
      setCurrentStep("info")
    }
  }

  const addPollOption = () => {
    if (newPoll.options.length < 10) {
      setNewPoll((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }))
    }
  }

  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }))
    }
  }

  const createPoll = () => {
    if (newPoll.title && newPoll.options.every((opt) => opt.trim())) {
      const poll = {
        id: Date.now().toString(),
        title: newPoll.title,
        options: newPoll.options.map((text, index) => ({
          id: `opt-${index}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
        isActive: true,
      }
      setPolls((prev) => [...prev, poll])
      setNewPoll({ title: "", options: ["", ""] })
    }
  }

  const deletePoll = (pollId: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== pollId))
  }

  const handleAdminLogin = (email: string, password: string) => {
    // Basic email validation (replace with secure authentication)
    const admin = admins.find((a) => a.email === email && a.password === password)
    if (admin) {
      setAdminLoggedIn(true)
    }
  }

  const handleCreateAdmin = () => {
    if (newAdmin.email && newAdmin.password) {
      setAdmins((prev) => [...prev, { email: newAdmin.email, password: newAdmin.password }])
      setNewAdmin({ email: "", password: "" })
    }
  }

  if (adminLoggedIn) {
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
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-balance">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage polls and view results</p>
            </div>
            <Button variant="outline" onClick={() => setAdminLoggedIn(false)}>
              Switch to User View
            </Button>
          </div>

          <Tabs defaultValue="polls" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="polls">Active Polls</TabsTrigger>
              <TabsTrigger value="create">Create Poll</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="createAdmin">Create Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="polls" className="space-y-4">
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
                        <Badge variant={poll.isActive ? "default" : "outline"}>
                          {poll.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => deletePoll(poll.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Poll</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="poll-title">Poll Title</Label>
                    <Input
                      id="poll-title"
                      placeholder="Enter your poll question..."
                      value={newPoll.title}
                      onChange={(e) => setNewPoll((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Poll Options</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addPollOption}
                        disabled={newPoll.options.length >= 10}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Option
                      </Button>
                    </div>

                    {newPoll.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...newPoll.options]
                            newOptions[index] = e.target.value
                            setNewPoll((prev) => ({ ...prev, options: newOptions }))
                          }}
                        />
                        {newPoll.options.length > 2 && (
                          <Button variant="outline" size="icon" onClick={() => removePollOption(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button onClick={createPoll} className="w-full">
                    Create Poll
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Vote Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
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
            </TabsContent>

            <TabsContent value="createAdmin">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="Enter admin email..."
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password..."
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleCreateAdmin} className="w-full">
                    Create Admin
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">Quick Poll</h1>
          <p className="text-muted-foreground">Share your opinion in just a few steps</p>
          {!adminLoggedIn && (
            <AdminLogin
              onLogin={(email: string) => {
                // Find the admin with the given email and call handleAdminLogin with the email and password
                const admin = admins.find((a) => a.email === email)
                if (admin) {
                  handleAdminLogin(email, admin.password)
                }
              }}
            />
          )}
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep === "info" ? 1 : currentStep === "otp" ? 2 : currentStep === "vote" ? 3 : 4} of 4
            </span>
            <span className="text-sm text-muted-foreground">
              {currentStep === "info"
                ? "Your Info"
                : currentStep === "otp"
                  ? "Verification"
                  : currentStep === "vote"
                    ? "Vote"
                    : "Results"}
            </span>
          </div>
          <Progress
            value={currentStep === "info" ? 25 : currentStep === "otp" ? 50 : currentStep === "vote" ? 75 : 100}
            className="h-2"
          />
        </div>

        {currentStep === "info" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Enter Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUserInfo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={user.name}
                    onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={user.email}
                    onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue to Verification
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === "otp" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Verify Your Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We've sent a verification code to <strong>{user.email}</strong>
              </p>
              <div className="space-y-2">
                <Label>Enter 6-digit code</Label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">For demo purposes, enter any 6 digits</div>
              <Button onClick={handleOtpVerification} className="w-full" disabled={otp.length !== 6}>
                Verify & Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "vote" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Cast Your Vote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-balance">{selectedPoll.title}</h3>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {selectedPoll.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button onClick={handleVote} className="w-full" disabled={!selectedOption}>
                Submit Vote
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "results" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Thank You for Voting!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="text-green-700 dark:text-green-300">Your vote has been recorded successfully</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{selectedPoll.title}</h3>
                <div className="space-y-3">
                  {selectedPoll.options.map((option) => {
                    const percentage = selectedPoll.totalVotes > 0 ? (option.votes / selectedPoll.totalVotes) * 100 : 0
                    const isSelected = option.id === selectedOption
                    return (
                      <div
                        key={option.id}
                        className={`space-y-2 p-3 rounded-lg ${isSelected ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}
                      >
                        <div className="flex justify-between text-sm">
                          <span className={isSelected ? "font-medium" : ""}>
                            {option.text} {isSelected && "(Your choice)"}
                          </span>
                          <span className="text-muted-foreground">
                            {option.votes} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total votes: {selectedPoll.totalVotes}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
