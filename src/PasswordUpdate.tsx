
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./components/ui/input";

// Placeholder Form components
export const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;
export const FormControl = ({ children }: any) => <>{children}</>;
export const FormField = ({ children }: any) => <>{children}</>;
export const FormItem = ({ children }: any) => <div>{children}</div>;
export const FormLabel = ({ children }: any) => <label>{children}</label>;
export const FormMessage = () => null;

// Placeholder Dialog components
export const Dialog = ({ children }: any) => <div>{children}</div>;
export const DialogContent = ({ children }: any) => <div>{children}</div>;
export const DialogDescription = ({ children }: any) => <div>{children}</div>;
export const DialogHeader = ({ children }: any) => <div>{children}</div>;
export const DialogTitle = ({ children }: any) => <div>{children}</div>;
export const DialogTrigger = ({ children }: any) => <div>{children}</div>;
import { Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Placeholder useLanguage hook
const useLanguage = () => ({ t: (key: string) => key });


interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordUpdate = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: t('password.mismatch.title'),
        description: t('password.mismatch.description'),
        variant: "destructive"
      });
      return;
    }

    if (data.newPassword.length < 6) {
      toast({
        title: t('password.tooShort.title'),
        description: t('password.tooShort.description'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('password.updated.title'),
        description: t('password.updated.description'),
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: t('password.updateFailed.title'),
        description: t('password.updateFailed.description'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-orange-700">
          <Lock className="h-5 w-5" />
          <span>{t('password.security.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('password.security.description')}
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                {t('password.changePassword')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>{t('password.changePassword')}</span>
                </DialogTitle>
                <DialogDescription>
                  {t('password.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password.currentPassword')}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              placeholder={t('password.currentPassword.placeholder')}
                              className="border-orange-200 focus:border-orange-400 pr-12"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password.newPassword')}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder={t('password.newPassword.placeholder')}
                              className="border-orange-200 focus:border-orange-400 pr-12"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('password.confirmPassword')}</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder={t('password.confirmPassword.placeholder')}
                              className="border-orange-200 focus:border-orange-400 pr-12"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      disabled={isLoading}
                    >
                      {isLoading ? t('password.updating') : t('password.updatePassword')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setOpen(false)}
                      disabled={isLoading}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordUpdate;
