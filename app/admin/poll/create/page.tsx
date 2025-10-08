"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import axios from "axios"
import { useRouter } from "next/navigation"

const CreatePolls = () => {
  const router = useRouter();
  useEffect(() => {
    const session = sessionStorage.getItem("auth")
    if (!session) {
      router.push("/login")
    }
  }, [])
  const backendurl = process.env.BACKEND_BASE_URL
  const [newPoll, setNewPoll] = useState({
    title: "",
    options: ["", ""],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)
  const [createdPollId, setCreatedPollId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = async () => {
    if (!createdPollId) return

    const pollUrl = `http://localhost:3000/${createdPollId}`
    try {
      await navigator.clipboard.writeText(pollUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const createPoll = async () => {
    // Validation
    if (!newPoll.title.trim()) {
      setError("Please enter a poll title")
      return
    }

    const validOptions = newPoll.options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      setError("Please enter at least 2 options")
      return
    }

    if (validOptions.length !== newPoll.options.length) {
      setError("Please fill in all options or remove empty ones")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(`http://localhost:8000/poll/`, newPoll)
      console.log(response)

      const data = await response.data
      console.log(data)

      setCreatedPollId(data.pollId)
      setSuccessDialogOpen(true)

      setNewPoll({
        title: "",
        options: ["", ""],
      })
    } catch (err) {
      console.error("Error creating poll:", err)
      setError(err instanceof Error ? err.message : "Failed to create poll")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = newPoll.title.trim() &&
    newPoll.options.filter(opt => opt.trim()).length >= 2 &&
    newPoll.options.every(opt => opt.trim() !== "")

  return (
    <>
      <div className="md:h-[calc(100vh-210px)] h-[calc(100vh-190px)]">
        <Card>
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="poll-title">Poll Title</Label>
              <Input
                id="poll-title"
                placeholder="Enter your poll question..."
                value={newPoll.title}
                onChange={(e) => {
                  setNewPoll((prev) => ({ ...prev, title: e.target.value }))
                  setError(null)
                }}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Poll Options</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPollOption}
                  disabled={newPoll.options.length >= 10 || isLoading}
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
                      setError(null)
                    }}
                    disabled={isLoading}
                  />
                  {newPoll.options.length > 2 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removePollOption(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={createPoll}
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Creating Poll..." : "Create Poll"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-600">Poll Created Successfully!</DialogTitle>
            <DialogDescription>
              Your poll has been created and is now ready to share. Use the link below to share it with others.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
              <code className="flex-1 text-sm">
                http://localhost:3000/{createdPollId?.toString()}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSuccessDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(`http://localhost:3000/${createdPollId}`, '_blank')
                }}
              >
                View Poll
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreatePolls