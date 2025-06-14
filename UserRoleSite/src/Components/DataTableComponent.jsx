import { memo, useState } from 'react';
import DataTable from 'react-data-table-component';

const DataTableComponent = ({ rowData, columnData }) => {
    const [filterText, setFilterText] = useState('');

    const filteredItems = rowData.filter(
        item =>
            item.name && item.name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.email && item.email.toLowerCase().includes(filterText.toLowerCase()) ||
            item.role && item.role.toLowerCase().includes(filterText.toLowerCase()) 
    );

    const subHeaderComponent = (
        <input
            type="text"
            placeholder="Search"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                marginBottom: '10px',
                width: '200px',
            }}
        />
    );

    return (
        <div className='mt-5 border shadow p-4 rounded' style={{ maxWidth: 'auto', margin: '0 auto' }}>
            <DataTable
                columns={columnData}
                data={filteredItems}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15,20]}
                subHeader
                subHeaderComponent={subHeaderComponent}
                highlightOnHover
                pointerOnHover
                responsive
                noDataComponent={
                    <div style={{ padding: '20px', color: '#999', fontSize: '16px', fontWeight: '500' }}>
                        No matching records found
                    </div>
                }

                footer={
                    <div style={{ padding: '10px', fontWeight: 'bold' }}>
                        Total records: {filteredItems.length}
                    </div>
                }
                customStyles={{
                    header: {
                        style: {
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#333',
                        },
                    },
                    rows: {
                        style: {
                            minHeight: '50px',
                            fontSize: '16px',
                        },
                    },
                    headCells: {
                        style: {
                            backgroundColor: '#f4f4f4',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#444',
                            borderRight: '1px solid #ddd',
                        },
                    }, cells: {
                        style: {
                            borderRight: '1px solid #eee',
                        },
                    },
                    pagination: {
                        style: {
                            borderTop: '1px solid #ddd',
                            paddingTop: '10px',
                        },
                    },
                }}
            />
        </div>
    )
}

export default memo(DataTableComponent); 
