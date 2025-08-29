import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Search, MoreVertical, Eye, Trash2 } from "lucide-react";
import { dummyPDFs, type PDFDocument } from "@/lib/data";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PDFs() {
  const [pdfs, setPdfs] = useState<PDFDocument[]>(dummyPDFs);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filteredPDFs = pdfs.filter(pdf =>
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pdf.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Internal Medicine': 'bg-blue-100 text-blue-800',
      'Anatomy': 'bg-green-100 text-green-800',
      'Pathology': 'bg-purple-100 text-purple-800',
      'Pharmacology': 'bg-orange-100 text-orange-800',
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">My PDFs</h1>
            <p className="text-sm text-muted-foreground">{pdfs.length} documents</p>
          </div>
          <Button
            onClick={() => setShowUpload(!showUpload)}
            className="medical-gradient text-primary-foreground"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      {/* Upload Area */}
      {showUpload && (
        <div className="border-b border-border p-4 bg-muted/30">
          <Card>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 100MB • Supports: PDF files
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PDF List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <div className="space-y-3">
          {filteredPDFs.map((pdf) => (
            <Card key={pdf.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-tight mb-1 truncate">
                        {pdf.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {pdf.author}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getSubjectColor(pdf.subject)}>
                          {pdf.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(pdf.uploadDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(pdf.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pdf.pageCount} pages</span>
                  <span>{pdf.fileSize}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPDFs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No PDFs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          )}

          {pdfs.length === 0 && (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No PDFs yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first textbook or study material to get started
              </p>
              <Button
                onClick={() => setShowUpload(true)}
                className="medical-gradient text-primary-foreground"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}