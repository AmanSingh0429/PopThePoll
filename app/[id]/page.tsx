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
import axios from "axios"
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Pause } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PollStep = "info" | "otp" | "vote" | "results"

interface PollOption {
  id: string
  pollId: string
  text: string
}

interface VoteResult {
  optionId: string
  text: string
  votes: number
  percentage: number
}

const Page = ({ params }: { params: { id: string } }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  })
  const [otp, setOtp] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [isPollActive, setIsPollActive] = useState(false)
  const [pollExists, setPollExists] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [voteResults, setVoteResults] = useState<VoteResult[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  const id = params.id
  const [currentStep, setCurrentStep] = useState<PollStep>("info")
  const [poll, setPoll] = useState({
    title: "",
    id: "",
    active: false,
    options: [] as PollOption[],
    createdAt: "",
  })

  useEffect(() => {
    const verifyActivePoll = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`http://localhost:8000/poll/${id}`)

        setPollExists(true)
        setIsPollActive(response.data.active)
        setPoll(response.data)
      } catch (error: any) {
        console.error("Error fetching poll:", error)
        if (error.response?.status === 404) {
          setPollExists(false)
        } else {
          setError("Failed to load poll. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    }
    verifyActivePoll()
  }, [id])

  const handleUserInfo = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user.name.trim() || !user.email.trim()) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await axios.post("http://localhost:8000/otp/request", user)
      setCurrentStep("otp")
    } catch (error: any) {
      console.error("Error requesting OTP:", error)
      setError(error.response?.data?.message || "Failed to send verification code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpVerification = async () => {
    if (otp.length !== 6) {
      setError("Please enter a 6-digit code")
      return
    }

    try {
      setIsVerifying(true)
      setError(null)
      const response = await axios.post("http://localhost:8000/otp/verify", {
        otp,
        email: user.email
      })

      if (response.status === 200) {
        setCurrentStep("vote")
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error)
      setError(error.response?.data?.message || "Invalid verification code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVote = async () => {
    if (!selectedOption) {
      setError("Please select an option to vote")
      return
    }

    try {
      setIsVoting(true)
      setError(null)

      // Submit the vote
      const voteResponse = await axios.post("http://localhost:8000/vote", {
        pollId: poll.id,
        optionId: selectedOption,
        voterEmail: user.email,
        voterName: user.name
      })

      // Fetch updated results
      const resultsResponse = await axios.get(`http://localhost:8000/poll/${id}/results`)
      setVoteResults(resultsResponse.data.options)
      setTotalVotes(resultsResponse.data.totalVotes)

      setCurrentStep("results")
      setSuccessDialogOpen(true)
    } catch (error: any) {
      console.error("Error submitting vote:", error)
      if (error.response?.status === 409) {
        setError("You have already voted in this poll.")
      } else {
        setError(error.response?.data?.message || "Failed to submit vote. Please try again.")
      }
    } finally {
      setIsVoting(false)
    }
  }

  const handleBack = () => {
    if (currentStep === "otp") {
      setCurrentStep("info")
    } else if (currentStep === "vote") {
      setCurrentStep("otp")
    }
  }

  const handleReset = () => {
    setUser({ name: "", email: "" })
    setOtp("")
    setSelectedOption("")
    setError(null)
    setCurrentStep("info")
  }

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            <div className="text-center my-4">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <h1 className="text-2xl font-bold">Loading poll...</h1>
                <p className="text-gray-600">Please wait while we load the poll details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!pollExists) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            <div className="text-center my-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Poll not found</h1>
              <p className="text-gray-600 mb-4">The poll you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isPollActive) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            <div className="text-center my-4">
              <Pause className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Poll not active</h1>
              <p className="text-gray-600 mb-4">This poll is currently inactive and not accepting votes.</p>
              <Button onClick={() => window.location.href = '/'}>
                Browse Active Polls
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <div className="p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="h-6 w-6 p-0 text-red-500 hover:bg-red-100"
                >
                  ×
                </Button>
              </div>
            )}

            <div className="text-center my-4">
              <h1 className="text-4xl font-bold">Vote for your poll</h1>
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
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !user.name.trim() || !user.email.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          "Continue to Verification"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {currentStep === "otp" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="h-8 w-8 p-0 mr-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          2
                        </span>
                        Verify Your Email
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      We've sent a verification code to <strong>{user.email}</strong>
                    </p>
                    <div className="space-y-2">
                      <Label>Enter 6-digit code</Label>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isVerifying}>
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
                    <div className="text-center text-sm text-muted-foreground">
                      For demo purposes, enter any 6 digits
                    </div>
                    <Button
                      onClick={handleOtpVerification}
                      className="w-full"
                      disabled={otp.length !== 6 || isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Continue"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === "vote" && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="h-8 w-8 p-0 mr-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                          3
                        </span>
                        Cast Your Vote
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-balance">{poll.title}</h3>
                      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                        {poll.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                          >
                            <RadioGroupItem value={option.id} id={option.id} disabled={isVoting} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                              {option.text}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <Button
                      onClick={handleVote}
                      className="w-full"
                      disabled={!selectedOption || isVoting}
                    >
                      {isVoting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting Vote...
                        </>
                      ) : (
                        "Submit Vote"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {currentStep === "results" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        4
                      </span>
                      Voting Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-balance">{poll.title}</h3>
                      <div className="space-y-4">
                        {voteResults.map((result) => (
                          <div key={result.optionId} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{result.text}</span>
                              <span className="text-sm text-muted-foreground">
                                {result.votes} votes ({result.percentage}%)
                              </span>
                            </div>
                            <Progress value={result.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Total votes: {totalVotes}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleReset} className="flex-1">
                        Vote Again
                      </Button>
                      <Button onClick={() => window.location.href = '/'} className="flex-1">
                        Browse Other Polls
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="text-center text-green-600">Vote Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for participating in the poll. Your vote has been recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setSuccessDialogOpen(false)} className="flex-1">
              View Results
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Page