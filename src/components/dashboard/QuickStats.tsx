
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Receiver } from "@/lib/types"

type QuickStatsProps = {
  receivers: Receiver[]
}

const QuickStats = ({ receivers }: QuickStatsProps) => {
  const getMonthlyEventCount = () => {
    return receivers.filter(r => {
      const date = new Date(r.event_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    }).length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
        <CardDescription>Overview of your events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Total Events</p>
            <p className="text-3xl font-bold">{receivers.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">This Month</p>
            <p className="text-3xl font-bold">{getMonthlyEventCount()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickStats
