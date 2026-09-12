import ApplicationForm from "@/components/application-form";
import UpdateApplicationForm from "@/components/update-application-form";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <ApplicationForm />
      <UpdateApplicationForm />
    </div>
  );
}
