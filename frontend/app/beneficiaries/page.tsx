"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Clock, Download, FileText, Info, Plus, Trash2, User } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface Beneficiary {
  id: string
  address: string
  percentage: number
  name: string
  relationship: string
  email?: string
  contact?: string
}

export default function BeneficiariesPage() {
  const { address, connectWallet } = useWallet()
  const { toast } = useToast()
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      percentage: 80,
      name: "Primary Beneficiary",
      relationship: "Family",
      email: "primary@example.com",
      contact: "+1 (555) 123-4567",
    },
    {
      id: "2",
      address: "0x82D8861B139B4a9c9F0d7aB0D5135d6a4a536F45",
      percentage: 20,
      name: "Secondary Beneficiary",
      relationship: "Friend",
      email: "secondary@example.com",
    },
  ])
  const [inactivityPeriod, setInactivityPeriod] = useState(90) // days
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [activeTab, setActiveTab] = useState("beneficiaries")
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const addBeneficiary = () => {
    if (beneficiaries.length >= 5) {
      toast({
        title: "Maximum beneficiaries reached",
        description: "You can add up to 5 beneficiaries",
        variant: "destructive",
      })
      return
    }

    const newId = Date.now().toString()
    setBeneficiaries([
      ...beneficiaries,
      {
        id: newId,
        address: "",
        percentage: 0,
        name: `Beneficiary ${beneficiaries.length + 1}`,
        relationship: "",
      },
    ])
  }

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(beneficiaries.filter((b) => b.id !== id))
  }

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string | number) => {
    setBeneficiaries(beneficiaries.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const getTotalPercentage = () => {
    return beneficiaries.reduce((sum, b) => sum + b.percentage, 0)
  }

  const saveBeneficiaries = () => {
    const total = getTotalPercentage()
    if (total !== 100) {
      toast({
        title: "Invalid allocation",
        description: `Total percentage must be 100%. Current total: ${total}%`,
        variant: "destructive",
      })
      return
    }

    // Validate wallet addresses
    const invalidAddresses = beneficiaries.filter((b) => !b.address.startsWith("0x") || b.address.length < 40)
    if (invalidAddresses.length > 0) {
      toast({
        title: "Invalid wallet addresses",
        description: "One or more beneficiary wallet addresses are invalid",
        variant: "destructive",
      })
      return
    }

    // Here you would save to blockchain
    toast({
      title: "Beneficiaries saved",
      description: "Your inheritance plan has been updated",
    })
  }

  const downloadAgreement = () => {
    toast({
      title: "Agreement downloaded",
      description: "Your inheritance agreement has been downloaded",
    })
  }

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">Please connect your wallet to manage your beneficiaries</p>
          <Button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-blue-600">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold mb-2">Manage Beneficiaries</h1>
          <p className="text-gray-400 mb-6">Set up who will receive your assets and how they will be distributed</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-white/10">
              <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
              <TabsTrigger value="settings">Inheritance Settings</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="beneficiaries" className="mt-4 space-y-6">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Your Beneficiaries</CardTitle>
                    <CardDescription>
                      Add wallet addresses of your beneficiaries and allocate percentages
                    </CardDescription>
                  </div>
                  <Button
                    onClick={addBeneficiary}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-white/10"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add beneficiary</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="p-4 rounded-lg bg-gray-900/50 border border-white/5 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-purple-400" />
                            <Label htmlFor={`name-${beneficiary.id}`} className="sr-only">
                              Name
                            </Label>
                            <Input
                              id={`name-${beneficiary.id}`}
                              value={beneficiary.name}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "name", e.target.value)}
                              className="h-7 bg-transparent border-none text-sm font-medium focus-visible:ring-0 p-0 w-auto"
                            />
                          </div>
                          {beneficiaries.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBeneficiary(beneficiary.id)}
                              className="h-7 w-7 text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`address-${beneficiary.id}`}>Wallet Address</Label>
                            <Input
                              id={`address-${beneficiary.id}`}
                              value={beneficiary.address}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "address", e.target.value)}
                              placeholder="0x..."
                              className="bg-black/30 border-white/10"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor={`percentage-${beneficiary.id}`}>Allocation Percentage</Label>
                              <span className="text-sm font-medium">{beneficiary.percentage}%</span>
                            </div>
                            <Slider
                              id={`percentage-${beneficiary.id}`}
                              min={0}
                              max={100}
                              step={1}
                              value={[beneficiary.percentage]}
                              onValueChange={(value) => updateBeneficiary(beneficiary.id, "percentage", value[0])}
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`relationship-${beneficiary.id}`}>Relationship</Label>
                            <Select
                              value={beneficiary.relationship}
                              onValueChange={(value) => updateBeneficiary(beneficiary.id, "relationship", value)}
                            >
                              <SelectTrigger
                                id={`relationship-${beneficiary.id}`}
                                className="bg-black/30 border-white/10"
                              >
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Family">Family</SelectItem>
                                <SelectItem value="Friend">Friend</SelectItem>
                                <SelectItem value="Partner">Partner</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`email-${beneficiary.id}`}>Contact Email (Optional)</Label>
                            <Input
                              id={`email-${beneficiary.id}`}
                              value={beneficiary.email || ""}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "email", e.target.value)}
                              placeholder="email@example.com"
                              className="bg-black/30 border-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`contact-${beneficiary.id}`}>Additional Contact Info (Optional)</Label>
                          <Input
                            id={`contact-${beneficiary.id}`}
                            value={beneficiary.contact || ""}
                            onChange={(e) => updateBeneficiary(beneficiary.id, "contact", e.target.value)}
                            placeholder="Phone number or other contact details"
                            className="bg-black/30 border-white/10"
                          />
                        </div>
                      </div>
                    ))}

                    <div
                      className={`flex items-center p-3 rounded-lg ${
                        getTotalPercentage() === 100
                          ? "bg-green-900/20 text-green-400"
                          : "bg-amber-900/20 text-amber-400"
                      }`}
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <div className="text-sm">
                        Total allocation: <span className="font-bold">{getTotalPercentage()}%</span>
                        {getTotalPercentage() !== 100 && " (must be 100%)"}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild className="border-white/10">
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button
                    onClick={saveBeneficiaries}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Save Beneficiaries
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4 space-y-6">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Inactivity Settings</CardTitle>
                  <CardDescription>
                    Define how long your account needs to be inactive before the inheritance is triggered
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="inactivity">Inactivity Period (Days)</Label>
                      <span className="text-sm font-medium">{inactivityPeriod} days</span>
                    </div>
                    <Slider
                      id="inactivity"
                      min={30}
                      max={365}
                      step={1}
                      value={[inactivityPeriod]}
                      onValueChange={(value) => setInactivityPeriod(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>30 days</span>
                      <span>180 days</span>
                      <span>365 days</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-900/20 border border-blue-900/30">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-400">How Inactivity Is Measured</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Inactivity is measured from your last interaction with the blockchain, including:
                        </p>
                        <ul className="text-sm text-gray-300 mt-2 space-y-1 list-disc list-inside">
                          <li>Logging into this platform</li>
                          <li>Making any transaction with your wallet</li>
                          <li>Manually resetting the inactivity timer</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Settings</h3>

                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="notifications" className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Email notifications before triggering</span>
                      </Label>
                      <Switch id="notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    {emailNotifications && (
                      <div className="space-y-2 pl-6">
                        <Label htmlFor="notification-email">Notification Email</Label>
                        <Input
                          id="notification-email"
                          placeholder="your@email.com"
                          className="bg-black/30 border-white/10"
                        />
                        <p className="text-xs text-gray-400">
                          We'll send you reminders when your account is approaching inactivity threshold
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documentation" className="mt-4 space-y-6">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Inheritance Documentation</CardTitle>
                  <CardDescription>Review and download your inheritance agreement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5">
                    <div className="flex items-center mb-4">
                      <FileText className="h-6 w-6 text-purple-400 mr-2" />
                      <h3 className="text-lg font-medium">Inheritance Agreement</h3>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-300 mb-4">
                      <h4 className="font-medium mb-2">CRYPTO INHERITANCE AGREEMENT</h4>
                      <p className="mb-2">
                        This Crypto Inheritance Agreement ("Agreement") is entered into by you ("Asset Owner") and is
                        effective as of the date of digital signature.
                      </p>

                      <h5 className="font-medium mt-4 mb-1">1. PURPOSE</h5>
                      <p className="mb-2">
                        This Agreement establishes the terms and conditions under which your digital assets will be
                        transferred to your designated beneficiaries in the event of prolonged inactivity.
                      </p>

                      <h5 className="font-medium mt-4 mb-1">2. INACTIVITY PERIOD</h5>
                      <p className="mb-2">
                        You have designated an inactivity period of {inactivityPeriod} days. If you do not interact with
                        the platform or perform any blockchain transactions during this period, the inheritance process
                        will be triggered.
                      </p>

                      <h5 className="font-medium mt-4 mb-1">3. BENEFICIARIES</h5>
                      <p className="mb-2">
                        You have designated the following beneficiaries to receive your digital assets:
                      </p>
                      <ul className="list-disc list-inside mb-2">
                        {beneficiaries.map((b) => (
                          <li key={b.id}>
                            {b.name} ({b.percentage}%) - Wallet: {b.address}
                          </li>
                        ))}
                      </ul>

                      <h5 className="font-medium mt-4 mb-1">4. ASSET DISTRIBUTION</h5>
                      <p className="mb-2">
                        Upon triggering of the inheritance process, your digital assets will be distributed according to
                        the percentages specified above.
                      </p>

                      <h5 className="font-medium mt-4 mb-1">5. LEGAL BINDING</h5>
                      <p className="mb-2">
                        This Agreement is executed via blockchain smart contract and constitutes a legally binding
                        agreement in jurisdictions where such digital agreements are recognized.
                      </p>
                    </div>

                    <div className="flex items-center mb-4">
                      <Switch id="terms" checked={termsAccepted} onCheckedChange={setTermsAccepted} className="mr-2" />
                      <Label htmlFor="terms" className="text-sm">
                        I have read and agree to the terms of the inheritance agreement
                      </Label>
                    </div>

                    <Button
                      onClick={downloadAgreement}
                      disabled={!termsAccepted}
                      className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Agreement
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Educational Resources</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:border-purple-500/50 transition-colors">
                        <h4 className="font-medium mb-2">Blockchain Inheritance Guide</h4>
                        <p className="text-sm text-gray-400">
                          A comprehensive guide to understanding how blockchain inheritance works.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-sm text-purple-400 mt-2">
                          Read Guide
                        </Button>
                      </div>

                      <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:border-blue-500/50 transition-colors">
                        <h4 className="font-medium mb-2">Legal Considerations</h4>
                        <p className="text-sm text-gray-400">
                          Important legal aspects of crypto inheritance in different jurisdictions.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-sm text-blue-400 mt-2">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
