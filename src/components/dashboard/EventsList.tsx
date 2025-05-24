
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Receiver } from "@/lib/types"
import { formatEventType } from "@/lib/utils"

type EventsListProps = {
  receivers: Receiver[]
  loading: boolean
}

const EventsList = ({ receivers, loading }: EventsListProps) => {
  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMMM d, yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Calendar className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (receivers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
        <p className="mt-1 text-gray-500">Get started by adding your first event.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {receivers.map((receiver) => (
        <div 
          key={receiver.receiver_id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{receiver.name}</h3>
              <p className="text-sm text-gray-500">
                {formatEventType(receiver.event_type)} • {formatEventDate(receiver.event_date)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">View</Button>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
