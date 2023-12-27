import React, {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import GoodService from "../../request/Goods/goodService";
import {DataGrid, GridColDef, ruRU} from "@mui/x-data-grid";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import {Edit} from "@mui/icons-material";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@mui/system";
import Noty, {button} from "noty";
import {NotificationManager} from "react-notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import {useSelect} from "@mui/base";
import {currentProject} from "../../features/project/projectSlice";
import {useSelector} from "react-redux";
import {hasPermission} from "../../helpers/helpers";
import user, {currentUser} from "../../features/user/user";

const VIEW = '/goods'
const UPLOAD = '/goods/upload'
const EDIT = '/goods/edit/'
const DELETE = '/goods/delete/'

export function Goods() {
    const project = useSelector(currentProject);
    const user = useSelector(currentUser);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);

    // Is invoked immediately after a component is mounted
    useEffect(() => {
        handleGetGoods()
    }, [project])

    const handleGetGoods = () => {
        setLoading(true)
        GoodService.goods(project).then((response) => {
            if (response.data.data) {
                setRows(response.data.data)
            } else {
                setRows([])
            }
            console.log(response)
        }).catch((error) => {
            console.log(error)
        }).finally(() => setLoading(false));
    }

    const canUpload = hasPermission(user, project, 'goods', 'upload');


    // const handleDeleteClick = (id) => {
    //   setTableLoading(true)
    //
    //   CityService.deleteCity(id).then((response) => {
    //     console.log(response)
    //     setRows((currentRows) =>
    //       currentRows.filter((row) => row.id !== id)
    //     );
    //   }).catch((error) => {
    //     console.log(error)
    //   }).finally(() => setTableLoading(false));
    // }

    const handleDeleteItem = (id) => {
        new Noty({
            layout: "topCenter",
            text: 'Вы действительно хотите удалить?',
            type: "alert",
            theme: 'metroui',
            closeWith: "button",
            buttons: [
                button('Удалить', 'btn btn-danger me-2', (noty) => onDelete(id, noty)),
                button('Не удалять', 'btn btn-light', (noty) => {
                    noty.close()
                }),
            ]
        }).show();
    }
    const onDelete = (id, noty) => {
        setTableLoading(true)
        GoodService.deleteGood(id)
            .then((response) => setRows((currentRows) =>
                currentRows.filter((row) => row.id !== id)
            ))
            .then(() => {
                NotificationManager.success('Успешно', 'Товар успешно удалено')
            })
            .catch((error) => NotificationManager.error('Не удалось удалить Товар'))
            .finally(() => {
                setTableLoading(false);
                noty.close();
            });
    }

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'barcode', headerName: 'Баркод', flex: 1},
        {field: 'brand', headerName: 'Бренд', flex: 1},
        {field: 'name', headerName: 'Название', flex: 1},
        {field: 'category_name', headerName: 'Категория', flex: 1},
        {
            field: 'action',
            headerName: 'Действие',
            renderCell: (params) => (
                <div>
                    <Tooltip title="Редактировать">
                        <Link to={EDIT + params.row.id} state={{row: params.row}}>
                            <IconButton
                                color="primary"
                            >
                                <Edit/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDeleteItem(params.row.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </div>
            ),
            flex: 1
        },
    ];

    return (
        <div>
            {loading
                ?
                (<div className="d-flex justify-content-center align-items-center">
                    <CircularProgress/>
                </div>)
                :
                (<div>
                    {
                        true &&
                        <Link to={UPLOAD}>
                            <button className="btn btn-success mb-3">
                                Загрузить товары
                            </button>
                        </Link>}

                    {
                        rows.length <= 0
                            ?
                            (<h1 className="d-flex justify-content-center align-items-center">Загрузить товары</h1>)
                            :
                            (
                                <ThemeProvider theme={createTheme(ruRU)}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        className="mt-3"
                                        initialState={{
                                            pagination: {
                                                paginationModel: {pageSize: 20},
                                            },
                                        }}
                                        pageSizeOptions={[]}
                                        loading={tableLoading}
                                    />
                                </ThemeProvider>
                            )
                    }
                </div>)
            }
        </div>
    )
}
