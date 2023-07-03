import { Table } from 'flowbite-react';
import { Badge } from 'flowbite-react';

export interface Result {
  insol: Array<number>;
  outsol: Array<number>;
  ops: Array<string>;
}

function ResultRow({insol, outsol, ops}: Result): JSX.Element {
  
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
      <div className="flex flex-wrap">
        {insol.map((x, index) => (
          <Badge className="ml-1 mr-1" key={index} color="gray">{x}</Badge>
        ))}
      </div>
    </Table.Cell>
    <Table.Cell>
      {outsol.join(" ")}
    </Table.Cell>
    <Table.Cell>
      <div className="flex flex-wrap">
      {ops.map((op, index) => (
        <Badge className="ml-1 mr-1" key={index} color="gray">{op}</Badge>
      ))}
      </div>
    </Table.Cell>
    <Table.Cell>
      <a
        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        href="/tables"
      >
        <p>
          Edit
        </p>
      </a>
    </Table.Cell>
  </Table.Row>

  )
}

export function Results( {results}: {results: Array<Result>}): JSX.Element {
  return (
        <Table striped>
          <Table.Head>
            <Table.HeadCell>
              Values Used
            </Table.HeadCell>
            <Table.HeadCell>
              Values Remaining
            </Table.HeadCell>
            <Table.HeadCell>
              Operations
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">
                Edit
              </span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {results.map((result: Result, index: number) => (
              <ResultRow key={index} insol={result.insol} outsol={result.outsol} ops={result.ops} />
            ))}
          </Table.Body>
        </Table>
    );
  }
  