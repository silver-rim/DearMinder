
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { CalendarPlus, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatEventType } from "@/lib/utils"

type EventsByTypeProps = {
  eventCounts: Record<string, number>
  loading: boolean
  onAddEvent: () => void
}

const EventsByType = ({ eventCounts, loading, onAddEvent }: EventsByTypeProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <PieChart className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart size={20} />
          <span>Events by Type</span>
        </CardTitle>
        <CardDescription>Distribution of your events</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(eventCounts).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(eventCounts).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{formatEventType(type)}</span>
                </div>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No event data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" className="w-full" onClick={onAddEvent}>
          <CalendarPlus size={16} className="mr-2" /> Add New Event
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventsByType;
