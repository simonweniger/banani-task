import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TableStyle } from "@/types/table";
import { Label } from "@radix-ui/react-label";

interface GenTableProps {
  tableProps: TableStyle;
}

function CellContent({ content }: { content: TableStyle["header"]["cells"][0]["content"] }) {
  if (!content.icon) {
    return <>{content.text}</>;
  }

  const iconElement = (
    <span
      className={cn(
        "material-symbols-rounded !text-[14px]",
        content.icon.className
      )}
    >
      {content.icon.name}
    </span>
  );

  return (
    <div className="flex items-center gap-2">
      {content.icon.position !== 'after' && iconElement}
      <span>{content.text}</span>
      {content.icon.position === 'after' && iconElement}
    </div>
  );
}

export default function GenTable({ tableProps }: GenTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {tableProps.title}
      </Label>
      <Table
        className={cn(
          tableProps.borderRadius ? `rounded-${tableProps.borderRadius}` : "",
          tableProps.bordered ? "border" : "border-none"
        )}
      >
        <TableHeader>
          <TableRow className={tableProps.header.className}>
            {tableProps.header.cells.map((cell, index) => (
              <TableHead key={index} className={cell.className}>
                <CellContent content={cell.content} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProps.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className={row.className}>
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cell.className}>
                  <CellContent content={cell.content} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
