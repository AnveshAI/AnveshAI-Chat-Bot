import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-slate-800 leading-tight mb-1">
            {article.title}
          </h4>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center text-xs text-slate-500">
            <span>{article.source}</span>
            <span className="mx-2">•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 mt-1 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
