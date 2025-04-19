"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/components/wallet-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bell,
  Clock,
  CreditCard,
  Info,
  Settings,
  Shield,
  User,
  Wallet,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import NotificationPanel from "@/components/notification-panel"

export default function Dashboard() {
  const { address, balance, connectWallet } = useWallet()
  const [progress, setProgress] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  // Mock data for the dashboard
  const cryptoHoldings = [
    {
      id: 1,
      name: "Ethereum",
      symbol: "ETH",
      amount: 100,
      value: 150,
      icon: "ETH",
    }
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "received",
      amount: "0.5 ETH",
      from: "0x1a2b...3c4d",
      timestamp: "2 hours ago",
      status: "completed",
    },
    { id: 2, type: "sent", amount: "0.1 ETH", to: "0x5e6f...7g8h", timestamp: "1 day ago", status: "completed" },
    { id: 3, type: "received", amount: "1.2 SOL", from: "0x9i0j...1k2l", timestamp: "3 days ago", status: "completed" },
    { id: 4, type: "sent", amount: "0.005 BTC", to: "0x3m4n...5o6p", timestamp: "1 week ago", status: "completed" },
  ]

  const beneficiaries = [
    { id: 1, name: "Primary Beneficiary", address: "0x71C...93E4", percentage: 80, relationship: "Family" },
    { id: 2, name: "Secondary Beneficiary", address: "0x82D...45F6", percentage: 20, relationship: "Friend" },
  ]

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

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500">
            Secure Your Crypto Legacy
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Ensure your digital assets are passed on to your chosen beneficiaries after a period of inactivity.
          </p>

          <div className="grid-pattern w-full h-64 rounded-xl overflow-hidden relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-blue-900/30" />
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center animate-float"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Wallet className="w-12 h-12 text-white" />
            </motion.div>

            {/* Animated particles */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-purple-500 animate-pulse-slow"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-blue-500 animate-pulse-slow"
              animate={{
                y: [0, 20, 0],
                x: [0, -15, 0],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-cyan-500 animate-pulse-slow"
              animate={{
                y: [0, 15, 0],
                x: [0, 20, 0],
              }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>

          <Button
            onClick={connectWallet}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Connect Wallet to Start
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
            <p className="text-gray-400">Manage your crypto inheritance settings and beneficiaries</p>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative border-white/10 hover:bg-white/5"
                    onClick={() => {
                      setShowNotifications(!showNotifications)
                      setUnreadNotifications(0)
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5" asChild>
                    <Link href="/settings">
                      <Settings className="h-5 w-5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>

        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-4 md:right-8 top-20 z-50"
          >
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-purple-500" />
                Wallet Balance
              </CardTitle>
              <CardDescription>Your current crypto assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                $
                {cryptoHoldings
                  .reduce((total, holding) => total + holding.value, 0)
                  .toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-gray-400 mt-1">Total value in USD</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Inheritance Status
              </CardTitle>
              <CardDescription>Your inheritance plan setup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Setup Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-gray-400 mt-2">
                  {progress < 100 ? (
                    <span className="flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1 text-amber-500" />
                      Complete your setup to activate inheritance
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 mr-1 text-green-500" />
                      Inheritance plan active
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0 h-auto text-blue-400" asChild>
                <Link href="/beneficiaries">
                  Complete Setup <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-cyan-500" />
                Activity Status
              </CardTitle>
              <CardDescription>Time until inheritance trigger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-medium text-green-500">Active</div>
              <div className="text-sm text-gray-400 mt-1">Last activity: Just now</div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-sm">
                  Inactivity threshold: <span className="font-medium">90 days</span>
                </div>
                <div className="flex items-center mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-400">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-white/10">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="mt-4">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Your Digital Assets</CardTitle>
                  <CardDescription>Assets that will be included in your inheritance plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cryptoHoldings.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-white/5"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-600/50 flex items-center justify-center mr-3">
                            <span className="font-bold text-white ">{asset.icon}</span>
                          </div>
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-sm text-gray-400">{asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {asset.amount.toFixed(4)} {asset.symbol}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${asset.value}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Estimated Value</span>
                        <span className="font-bold text-xl">
                          $
                          {(cryptoHoldings.reduce((total, holding) => total + holding.value, 0)).toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 2 },
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 text-right mt-1">Includes estimated NFT value</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600">
                    Add More Assets
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-4">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent cryptocurrency transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px] pr-4">
                    <div className="space-y-4">
                      {recentTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-white/5"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${tx.type === "received" ? "bg-green-900/50" : "bg-blue-900/50"
                                }`}
                            >
                              {tx.type === "received" ? (
                                <ArrowDown className="w-5 h-5 text-green-400" />
                              ) : (
                                <ArrowUp className="w-5 h-5 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {tx.type === "received" ? "Received" : "Sent"} {tx.amount}
                              </div>
                              <div className="text-sm text-gray-400">
                                {tx.type === "received" ? `From: ${tx.from}` : `To: ${tx.to}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{tx.timestamp}</div>
                            <div className="text-sm">
                              <Badge variant="outline" className="border-green-500 text-green-400">
                                {tx.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-white/10">
                    Export History
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="beneficiaries" className="mt-4">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Your Beneficiaries</CardTitle>
                  <CardDescription>People who will receive your assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {beneficiaries.map((beneficiary) => (
                      <div
                        key={beneficiary.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-white/5"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-600/50 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{beneficiary.name}</div>
                            <div className="text-sm text-gray-400">{beneficiary.address}</div>
                            <div className="text-xs text-gray-500 mt-1">Relationship: {beneficiary.relationship}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{beneficiary.percentage}% Share</div>
                          <Button variant="link" className="p-0 h-auto text-sm text-blue-400">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="p-3 rounded-lg bg-gray-900/50 border border-white/5 border-dashed flex items-center justify-center">
                      <Button variant="ghost" className="text-gray-400 hover:text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Beneficiary
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-900/30">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-400">Inheritance Terms</h4>
                        <p className="text-sm text-gray-300 mt-1">
                          Your assets will be transferred to your beneficiaries after 90 days of inactivity. You can
                          reset this timer by logging in or performing any transaction.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Link href="/beneficiaries">Manage Beneficiaries</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card className="bg-black/40 border border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent transactions and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[320px] pr-4">
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10"></div>

                      <div className="space-y-6 pl-10 relative">
                        <div className="relative">
                          <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-blue-500"></div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Wallet Connected</h4>
                              <Badge variant="outline" className="ml-2 border-blue-500 text-blue-400">
                                Just now
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">You connected your wallet to the platform</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-purple-500"></div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Beneficiary Updated</h4>
                              <Badge variant="outline" className="ml-2 border-purple-500 text-purple-400">
                                2 days ago
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              You updated the allocation for Primary Beneficiary
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-green-500"></div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Inactivity Timer Reset</h4>
                              <Badge variant="outline" className="ml-2 border-green-500 text-green-400">
                                5 days ago
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">You logged in and reset the inactivity timer</p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-amber-500"></div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Inheritance Plan Created</h4>
                              <Badge variant="outline" className="ml-2 border-amber-500 text-amber-400">
                                1 week ago
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                              You created your inheritance plan with 2 beneficiaries
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-10 mt-1.5 w-4 h-4 rounded-full bg-cyan-500"></div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">Account Created</h4>
                              <Badge variant="outline" className="ml-2 border-cyan-500 text-cyan-400">
                                2 weeks ago
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">You created your CryptoInherit account</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600">
                    View Full Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-black/40 border border-white/10 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-900/30 to-blue-900/30">
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Learn more about blockchain inheritance and best practices</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:border-purple-500/50 transition-colors">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-purple-400" />
                    Inheritance Security
                  </h3>
                  <p className="text-sm text-gray-400">
                    Learn how our blockchain inheritance system keeps your assets secure.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm text-purple-400 mt-2">
                    Read More
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:border-blue-500/50 transition-colors">
                  <h3 className="font-medium mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-400" />
                    Beneficiary Best Practices
                  </h3>
                  <p className="text-sm text-gray-400">
                    Tips for selecting and managing your inheritance beneficiaries.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-sm text-blue-400 mt-2">
                    Read More
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-gray-900/50 border border-white/5 hover:border-cyan-500/50 transition-colors">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-cyan-400" />
                    Inactivity Monitoring
                  </h3>
                  <p className="text-sm text-gray-400">Understanding how the inactivity monitoring system works.</p>
                  <Button variant="link" className="p-0 h-auto text-sm text-cyan-400 mt-2">
                    Read More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
