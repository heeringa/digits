import { Table } from 'flowbite-react';

export interface Result {
  insol: Array<number>;
  outsol: Array<number>;
  ops: Array<string>;
}

function ResultRow({insol, outsol, ops}: Result): JSX.Element {
  
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
      {insol.join(" ")}
    </Table.Cell>
    <Table.Cell>
      {outsol.join(" ")}
    </Table.Cell>
    <Table.Cell>
      {ops.join(" ")}
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

function Results( {results}: {results: Array<Result>}): JSX.Element {
  return (
        <Table striped>
          <Table.Head>
            <Table.HeadCell>
              Numbers Used
            </Table.HeadCell>
            <Table.HeadCell>
              Numbers Remaining
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
            {results.map((result: Result) => ResultRow(result))}
          </Table.Body>
        </Table>
    );
  }

  export default Results;
  