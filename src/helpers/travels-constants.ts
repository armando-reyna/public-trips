import { Injectable } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

@Injectable()
export class TravelsConstants {

    /**
     * @property _messages
     * @description Used to store the messages key
     */
    public _messages: Object = {
        'userCardsFail': 'Hubo un problema al obtener las tarjetas asociadas, intenta más tarde',
        'userGetBalance': 'Obteniendo saldo ',
        'userGetBalanceFail': 'Hubo un problema al obtener los saldos de la tarjeta ',
        'productFail': 'Hubo un error al seleccionar el producto, por favor intenta más tarde.',
        'userServiceFail': 'Hubo un problema con el servidor, por favor intenta más tarde',
        'userLoginFail': 'Usuario o contraseña incorrectos, por favor intenta de nuevo',
        'userLogoutFail': 'Hubo un problema al cerrar la sesión, por favor inténtalo nuevamente',
        'userSessionFail': 'Hubo un problema al obtener la información del usuario, por favor inicia sesión nuevamente',
        'eventSaveOk': 'El informe de gastos se creó exitosamente',
        'eventsDeleteOk': 'El informe de gastos se eliminó correctamente',
        'endDateBeforeStartDate': 'La fecha de término no puede ser menor que la fecha inicial',
        'eventsLoading': 'Cargando lista de informes de gasto',
        'expenseYetSelected': 'El gasto seleccionado ya ha sido asociado a este informe de gastos',
        'rfcImageFail': 'Hubo un problema al obtener el RFC de tu empresa, por favor inténtalo más tarde',
        'transactionsListFail': 'Hubo un problema al obtener las transacciones, por favor inténtalo más tarde',
        'expensesTypesFail': 'Hubo un problema al obtener los tipos de gasto, por favor intenta más tarde',
        'expensesPayMethodFail': 'Hubo un problema al obtener los métodos de pago, por favor intenta más tarde',
        'expensesDeleteWait': 'Eliminando gasto',
        'expenseDeleteFail': 'Hubo un problema al borrar el gasto, por favor intenta más tarde',
        'expenseDeleteOk': 'El gasto se eliminó correctamente',
        'typeDataFail': 'Los datos ingresados son incorrectos, por favor verifica',
        'expensesSaveOk': 'El gasto se creó exitosamente',
        'expensesLoading': 'Cargando lista de gastos',
        'cameraFail': 'Hubo un problema con la cámara, por favor intenta más tarde',
        'cameraLoading': 'Preparando foto seleccionada...',
        'sendApprobalOk': 'El informe de gastos se envió correctamente a aprobación',
        'sendEmailWait': 'Enviando correo electrónico...',
        'sendEmailFail': 'Hubo un problema al enviar el correo, por favor intenta más tarde',
        'invoicesLoading': 'Cargando lista de facturas',
        'invoicesFail': 'Hubo un problema al obtener las facturas, por favor inténtalo más tarde',
        'spendingAmountExceeded': 'El monto ingresado excede el total de la compra.',
        'invoiceAmountExceeded': 'El monto de la factura excede el total de la compra.',
        'spendingAmountExceededInvoice': 'El monto ingresado excede al monto de la factura.',
        'invoiceAmountExceededSpending': 'El monto de la factura excede al monto de ingresado.'
    }

    public _emailPattern: string = `^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([\._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9\-])+(\.))+([a-zA-Z]{2,4})+$`;
    numberMask = createNumberMask({
        allowDecimal: true
    })
    constructor() {}
}
