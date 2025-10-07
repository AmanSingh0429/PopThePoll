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


type PollStep = "info" | "otp" | "vote" | "results"

const page = ({ params, }: { params: { id: string } }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  })
  const [otp, setOtp] = useState("")
  const [selectedOption, setSelectedOption] = useState("")
  const [isPollActive, setIsPollActive] = useState(Boolean)
  const [pollExsist, setPollExsist] = useState(Boolean)
  const id = params.id
  const [currentStep, setCurrentStep] = useState<PollStep>("vote")
  const [polls, setPolls] = useState({
    title: "",
    id: "",
    active: false,
    options: [{
      id: "",
      pollId: "",
      text: ""
    }],
    createdAt: "",
  });

  useEffect(() => {
    const verifyActivePoll = async () => {
      try {
        const activePoll = await axios.get(`http://localhost:8000/poll/${id}`)

        if (activePoll.status === 404) {
          setPollExsist(false)
          return
        }
        setPollExsist(true)
        setIsPollActive(activePoll.data.active)
        console.log("active poll data", activePoll.data)
        setPolls(activePoll.data)
      } catch (error) {
        console.log(error)
      }
    }
    verifyActivePoll()
  }, [])





  const handleUserInfo = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(user)
    try {
      const response = axios.post("http://localhost:8000/otp/request", user)
      setCurrentStep("otp")
    } catch (error) {
      console.log(error)
    }
  }

  const handleOtpVerification = async () => {
    console.log(otp)
    try {
      const response = await axios.post("http://localhost:8000/otp/verify", {
        otp,
        email: user.email
      })
      if (response.status === 200) {
        setCurrentStep("vote")
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleVote = () => {
    console.log("object")
  }



  if (!pollExsist) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="p-4 flex justify-center items-center flex-col min-h-screen">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-auto sm:p-6 p-2">
            <div className="text-center my-4">
              <h1 className="text-4xl font-bold">Poll not found</h1>
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
              <h1 className="text-4xl font-bold">Poll not active</h1>
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
                      <h3 className="text-lg font-semibold mb-4 text-balance">{polls.title}</h3>
                      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                        {polls.options.map((option) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page