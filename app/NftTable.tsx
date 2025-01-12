"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { NFT } from "../types";
import { Separator } from "@/components/ui/separator";

interface NFTTableProps {
  data: NFT[];
}

const NFTTable: React.FC<NFTTableProps> = ({ data }) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const maxNftl = useMemo(
    () => Math.max(...data.map((item) => item.nftl)),
    [data]
  );
  const maxPrice = useMemo(
    () => Math.max(...data.map((item) => item.priceInETH)),
    [data]
  );
  const totalNFTL = useMemo(
    () => data.reduce((sum, item) => sum + item.nftl, 0),
    [data]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [priceFilter, setPriceFilter] = useState([0, maxPrice]);
  const [nftlFilter, setNftlFilter] = useState([0, maxNftl]);

  const columns: ColumnDef<NFT>[] = [
    {
      accessorKey: "tokenId",
      header: "Degen",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Image
                  src={`https://app.niftyleague.com/img/degens/nfts/${row.original.tokenId}.webp`}
                  alt="NFT"
                  width={50}
                  height={54}
                  className="rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                />
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <Image
                  src={`https://app.niftyleague.com/img/degens/nfts/${row.original.tokenId}.webp`}
                  alt="NFT"
                  width={512}
                  height={561}
                  className="rounded-lg w-full h-auto"
                />
              </DialogContent>
            </Dialog>
            <div className="hidden md:block text-sm">{`# ${row.original.tokenId}`}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "priceInETH",
      header: () => (
        <div>
          <span className="md:hidden">Price</span>
          <span className="hidden md:inline">List price</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        const [min, max] = value as number[];
        const rowValue = parseFloat(row.getValue(id));
        return rowValue >= min && rowValue <= max;
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("priceInETH"));
        const usdPrice = row.original.priceInUSD;
        return (
          <div className="flex flex-col md:flex-row md-gap-2 items-start md:items-start">
            {amount.toLocaleString("en-US", { maximumFractionDigits: 4 })}
            <span className="text-gray-500">
              (${usdPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              )
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "nftl",
      header: () => (
        <>
          <span className="md:hidden">NFTL</span>
          <span className="hidden md:inline">Claimable NFTL</span>
        </>
      ),
      filterFn: (row, id, value) => {
        const [min, max] = value as number[];
        const rowValue = parseFloat(row.getValue(id));
        return rowValue >= min && rowValue <= max;
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("nftl"));
        const nftlPrice = row.original.nftlPrice;
        return (
          <div className="flex flex-col md:flex-row md-gap-2 items-start md:items-start">
            {amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            <span className="text-gray-500">
              ($
              {nftlPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })})
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "valueScore",
      header: () => (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="inline-flex items-center gap-1 cursor-help">
              <span className="md:hidden">Score</span>
              <span className="hidden md:inline">Bonk Score</span>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-96">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Bonk Score Explained</h3>
              <p className="text-sm text-muted-foreground">
                The Bonk Score helps you identify potentially undervalued
                Degens.
              </p>
              <div className="p-3 bg-muted rounded-lg">
                <code>Bonk Score = NFTL Value in USD / List Price in USD</code>
              </div>
              <p className="text-sm text-muted-foreground">
                A score above 100 indicates the claimable NFTL value exceeds the
                listing price.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ),
      filterFn: (row, id, value) => {
        const [min, max] = value as number[];
        const rowValue = parseFloat(row.getValue(id));
        return rowValue >= min && rowValue <= max;
      },
      cell: ({ row }) => {
        const score = parseFloat(row.getValue("valueScore"));
        return (
          <div className="flex flex-col md:flex-row md-gap-2 items-start md:items-start">
            {score.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </div>
        );
      },
    },
    {
      id: "links",
      header: "Buy on",
      cell: ({ row }) => (
        <div className="flex space-x-4">
          <a
            href={row.original.openseaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <Image
              src={"/opensea-logo.svg"}
              alt="OpenSea"
              width={24}
              height={24}
              className="rounded-md"
            />
          </a>
          <a
            href={row.original.blurLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-700"
          >
            <Image
              src={"/blur-logo.png"}
              alt="Blur"
              width={24}
              height={24}
              className="rounded-md"
            />
          </a>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    table.getColumn("nftl")?.setFilterValue(nftlFilter);
  }, [nftlFilter, table]);

  useEffect(() => {
    table.getColumn("priceInETH")?.setFilterValue(priceFilter);
  }, [priceFilter, table]);
  const metricsData = {
    degensForSale: data.length,
    totalNftlToClaim: 50000,
  };

  return (
    <>
      <div className="p-4 flex-col py-0 justify-around items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-8 ">
          <div className="flex order-1 md:order-0 items-center gap-4">
            <div className="flex flex-col my-4 text-center w-full md:text-left ">
              <h1 className="text-4xl mb-4  font-bold">
                Find Degens with
                <br /> Unclaimed NFTL
              </h1>
              <p className="">
                Explore Degens listed on OpenSea and check how much NFTL they
                can claim.
              </p>
              <Separator className="my-4 bg-slate-500" />
              <div className="flex flex-row items-center w-full justify-center md:justify-start space-x-4 py-4 w-full overflow-x-auto">
                <div className="flex flex-col justify-start min-w-[60px]">
                  <span className="text-sm font-medium ">Degens for Sale</span>
                  <span className="text-lg font-bold">
                    {metricsData.degensForSale.toLocaleString()}
                  </span>
                </div>
                <Separator
                  orientation="vertical"
                  className="h-12 bg-slate-500"
                />
                <div className="flex flex-col min-w-[60px]">
                  <span className="text-sm font-medium">
                    Total unclaimed NFTL
                  </span>
                  <span className="text-lg font-bold">
                    {totalNFTL.toLocaleString()} NFTL
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex order-0 md:order-1 flex-col w-full gap-4 px-4 justify-around items-center">
            <Image
              src="/nftl-token-generator.gif"
              alt="NFTL"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
      <Separator className="bg-slate-500" />
      <div className="">
        <div className="flex-col md:flex-row flex w-full ">
          <div className="flex flex-col gap-2  w-full p-4">
            <label className="text-sm mb-4 font-medium flex items-center gap-2">
              <Image
                src={"/nftl-logo.png"}
                alt="NFTL"
                width={24}
                height={24}
                className="rounded-md"
              />
              NFTL to claim
            </label>
            <div className="flex items-center justify-between gap-2 mb-8">
              <div className="flex w-full flex-col gap-2">
                <span className="text-xs">Min</span>
                <input
                  type="number"
                  value={nftlFilter[0]}
                  onChange={(e) =>
                    setNftlFilter([Number(e.target.value), nftlFilter[1]])
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  min={0}
                  max={nftlFilter[1]}
                  step={500}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="text-xs">Max</span>
                <input
                  type="number"
                  value={nftlFilter[1]}
                  onChange={(e) =>
                    setNftlFilter([nftlFilter[0], Number(e.target.value)])
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  min={nftlFilter[0]}
                  max={maxNftl}
                  step={500}
                />
              </div>
            </div>
            <Slider
              defaultValue={nftlFilter}
              max={maxNftl}
              step={500}
              value={nftlFilter}
              onValueChange={setNftlFilter}
              className="flex-1"
            />
          </div>
          <Separator orientation="vertical" className="my-4 bg-slate-500" />
          <div className="flex flex-col gap-2  w-full  p-4">
            <label className="text-sm font-medium mb-4">
              Price range (ETH)
            </label>
            <div className="flex items-center justify-between gap-2 mb-8">
              <div className="flex w-full flex-col gap-2">
                <span className="text-xs">Min</span>
                <input
                  type="number"
                  value={priceFilter[0]}
                  onChange={(e) =>
                    setPriceFilter([Number(e.target.value), priceFilter[1]])
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  min={0}
                  max={priceFilter[1]}
                  step={0.01}
                />
              </div>
              <div className="flex w-full flex-col gap-2">
                <span className="text-xs">Max</span>
                <input
                  type="number"
                  value={priceFilter[1]}
                  onChange={(e) =>
                    setPriceFilter([priceFilter[0], Number(e.target.value)])
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  min={priceFilter[0]}
                  max={maxPrice}
                  step={0.01}
                />
              </div>
            </div>
            <Slider
              defaultValue={priceFilter}
              max={maxPrice}
              step={0.01}
              value={priceFilter}
              onValueChange={setPriceFilter}
              className="flex-1 "
            />
          </div>
        </div>
        <Separator className="mb-8 bg-slate-500" />
        <Table className="w-full bg-background">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ArrowUpIcon className="inline  h-4 w-4" />,
                          desc: <ArrowDownIcon className="inline  h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="bg-background flex items-center w-full justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex items-center w-full justify-center space-x-2 py-4">
        <div className="">
          {/* <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="bg-background font-sm border-none  w-[100px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>
    </>
  );
};

export default NFTTable;
