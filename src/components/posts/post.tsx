import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import Link from "next/link";

type CardProps = React.ComponentProps<typeof Card> & { imageUrl: string, description: string, slug: string, id: string, };

export default function Post({ className, title, description, imageUrl, slug, id, ...props }: CardProps) {
  return (
    <Card className={cn(className)} {...props}>
      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt={title} className="w-full rounded-t-lg" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={`posts/${id}`}>
          <Button>
            Read
          </Button>
        </Link>

      </CardFooter>
    </Card>
  )
}
