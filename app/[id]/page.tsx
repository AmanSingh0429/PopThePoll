"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

type UserState = {
  name: string
  email: string
  hasVoted: boolean
  votedPolls: string[]
}
type PollStep = "info" | "otp" | "vote" | "results"

const page = ({ params, }: { params: { id: string } }) => {
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
  const [user, setUser] = useState<UserState>({
    name: "",
    email: "",
    hasVoted: false,
    votedPolls: [],
  })
  const [otp, setOtp] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [isPollActive, setIsPollActive] = useState(true)

  useEffect(() => {
    const verifyActivePoll = async () => {
      setIsPollActive(true)
    }
    verifyActivePoll()
  }, [])
  const id = params.id
  const [currentStep, setCurrentStep] = useState<PollStep>("info")
  const [selectedPoll, setSelectedPoll] = useState(mockPolls[0])



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
    // if (selectedOption) {
    //   // Update poll votes
    //   const updatedPolls = polls.map((poll) => {
    //     if (poll.id === selectedPoll.id) {
    //       return {
    //         ...poll,
    //         options: poll.options.map((option) =>
    //           option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option,
    //         ),
    //         totalVotes: poll.totalVotes + 1,
    //       }
    //     }
    //     return poll
    //   })

    //   setPolls(updatedPolls)
    //   setSelectedPoll(updatedPolls.find((p) => p.id === selectedPoll.id)!)
    //   setUser((prev) => ({
    //     ...prev,
    //     hasVoted: true,
    //     votedPolls: [...prev.votedPolls, selectedPoll.id],
    //   }))
    //   setCurrentStep("info")
    // }
  }


  return (
    <>
      <div className="h-screen flex justify-center items-center">
        {isPollActive ? (
          <div className="p-4 flex justify-center items-center flex-col min-h-screen">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
              <div className="text-center my-4">
                <h1 className="text-4xl font-bold">Vote for your favorite poll</h1>
              </div>
              <div className="">

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
          </div>
        ) : (
          <div className="rounded-3xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            <div className="text-center my-4">
              <h1 className="md:text-4xl text-xl font-bold">The Poll you are trying to vote in is not active</h1>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

export default page