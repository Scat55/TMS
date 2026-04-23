import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const AuthPage = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">TMS</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as 'login' | 'register')}
          >
            <TabsList className="w-full">
              <TabsTrigger value="login" className="w-full">
                Вход
              </TabsTrigger>
              <TabsTrigger value="register" className="w-full">
                Регистрация
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="login" forceMount hidden={tab !== 'login'}>
                  <LoginForm />
                </TabsContent>
                <TabsContent
                  value="register"
                  forceMount
                  hidden={tab !== 'register'}
                >
                  <RegisterForm />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
