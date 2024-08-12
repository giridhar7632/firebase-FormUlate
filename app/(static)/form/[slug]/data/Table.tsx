import { ENTRIES_PER_PAGE } from "@/utils/constants";

const Table = async ({ data, page }: { data: any; page: number }) => {
  return (
    <div className="mx-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th className="py-3 px-4 text-left font-medium border-r border-gray-300 dark:border-gray-600">
              Sl no
            </th>
            {Object.keys(data[0]).map((columnName: string) => (
              <th key={columnName} className="py-3 px-4 text-left font-medium">
                {columnName.toLocaleUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800">
          {data.map((row: any, idx: number) => (
            <tr
              key={idx}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <td className="p-4 border-r border-gray-200 dark:border-gray-700">
                {(page - 1) * ENTRIES_PER_PAGE + (idx + 1)}
              </td>
              {Object.keys(data[0]).map((columnName: any) => (
                <td key={columnName} className="p-4">
                  {row[columnName]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
