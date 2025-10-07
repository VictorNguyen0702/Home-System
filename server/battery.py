import requests
from flask import Flask, Blueprint, request
import json
import os

battery_bp = Blueprint('battery_bp', __name__, url_prefix='/battery')

sale_price = float(os.getenv('EXPORT_SALE'))
buy_price = float(os.getenv('IMPORT_COST'))

@battery_bp.route('system_data', methods=['GET'])
def system_data():
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] 
    headers = {'Authorization': f'Bearer {token}'} 

    response = requests.get(
        'https://monitor.byte-watt.com/api/stable/home/getCustomMenuEssList', 
        headers=headers, timeout=10
    )
    response.raise_for_status()
    print(response.json())
    data = response.json().get('data')[0]
    return {
        'systemSerialNum': data.get('sysSn'), # Single Value
        'systemId': data.get('systemId'), # Single Value
        'systemName': data.get('remark'), # Single Value
        'systemModel': data.get('minv'), # Single Value
        'systemStatus': data.get('emsStatus'), # Single Value
        'inverterPower': data.get('poinv'), # Single Value
        'installedCapacity': data.get('cobat'), # Single Value
        'usableCapacity': data.get('surpluscobat'), # Single Value
        'usablePercentage': data.get('uscapacity') # Single Value
    }


@battery_bp.route('daily_graph', methods=['GET'])
def daily_graph():
    sys_sn = request.args.get('sysSn')
    date = request.args.get('date')
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] 
    headers = {'Authorization': f'Bearer {token}'} 

    params = {
        'sysSn': sys_sn,
        'date': date
    }
    response = requests.get(
        'https://monitor.byte-watt.com/api/report/power/staticsByDay', 
        params=params, headers=headers, timeout=10
    )
    response.raise_for_status()

    data = response.json().get('data')
    return {
        'time': data.get('time'), # Array of Values
        'batteryPercent': data.get('cbat'), # Array of Values
        'gridExport': data.get('feedIn'), # Array of Values
        'gridImport': data.get('gridCharge'), # Array of Values
        'consumption': data.get('homePower'), # Array of Values
        'generation': data.get('ppv'), # Array of Values
    }


@battery_bp.route('daily_summary', methods=['GET'])
def daily_summary():
    sys_sn = request.args.get('sysSn')
    date = request.args.get('date')
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] 
    headers = {'Authorization': f'Bearer {token}'} 

    params = {
        'sn': sys_sn,
        'stationId': '',
        'tday': date
    }
    response = requests.get(
        'https://monitor.byte-watt.com/api/stable/home/getSumDataForCustomer', 
        params=params, headers=headers, timeout=10
    )
    response.raise_for_status()

    data = response.json().get('data')
    return {
        'consumption': data.get('eload'), # Single Value
        'generation': data.get('epvtoday'), # Single Value
        'batteryCharged': data.get('echarge'), # Single Value
        'batteryDischarged': data.get('edischarge'), # Single Value
        'gridExport': data.get('eoutput'), # Single Value
        'gridImport': data.get('einput'), # Single Value
        'selfConsumption': data.get('eselfConsumption'), # Single Value
        'selfSufficiency': data.get('eselfSufficiency'), # Single Value
        'carbonReduction': data.get('carbonNum'), # Single Value
        'treesPlanted': data.get('treeNum'), # Single Value
        'incomeDaily': data.get('todayIncome'), # Single Value
        'incomeTotal': data.get('totalIncome'), # Single Value
    }


@battery_bp.route('statistics_graph', methods=['GET'])
def statistics_graph():
    sys_sn = request.args.get('sysSn')
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')
    statisticBy = request.args.get('statisticBy')
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] 
    headers = {'Authorization': f'Bearer {token}'} 

    params = {
        'statisticBy': statisticBy,
        'startDate': start_date,
        'endDate': end_date,
        'sn': sys_sn
    }
    response = requests.get(
        'https://monitor.byte-watt.com/api/report/energy/systemStatistic',
        params=params, headers=headers, timeout=10
    )
    response.raise_for_status()
    data = response.json().get('data')

    # Calculate different costs
    consumption = data.get('eLoads')
    batteryCharged = data.get('eCharge')
    batteryDischarged = data.get('eDischarge')
    gridExport = data.get('eOutputs')
    gridImport = data.get('eInputs')

    # Generation * buyPrice
    totalCost = [round(x * buy_price, 2) for x in consumption]
    # (batteryDischarge + gridImport) * buyPrice - (batteryCharge + gridExport) * salePrice
    panelCost = [round((w + y) * buy_price - (x + z) * sale_price, 2) for w, x, y, z in zip(batteryDischarged, batteryCharged, gridImport, gridExport)]
    # gridImport * buyPrice - gridExport * salePrice 
    batteryCost = [round(x * buy_price - y * sale_price, 2) for x, y in zip(gridImport, gridExport)]

    return {
        'statisticsData': {
            'dates': data.get('statisticIndex'), # Array of Values
            'selfConsumption': data.get('eselfconsumption'), # Single Value
            'selfSufficiency': data.get('eselfsufficiency'), # Single Value
            'consumption': data.get('eLoads'), # Array of Values
            'generation': data.get('ePvs'), # Array of Values
            'batteryCharged': data.get('eCharge'), # Array of Values
            'batteryDischarged': data.get('eDischarge'), # Array of Values
            'gridExport': data.get('eOutputs'), # Array of Values
            'gridImport': data.get('eInputs'), # Array of Values
        },
        'incomeData': {
            'dates': data.get('statisticIndex'), # Array of Values
            'totalCost': totalCost, # Array of Values
            'panelCost': panelCost, # Array of Values
            'batteryCost': batteryCost, # Array of Values
        },
    }


@battery_bp.route('current_data', methods=['GET'])
def current_data():
    sys_sn = request.args.get('sysSn')
    auth_header = request.headers.get('Authorization')
    token = auth_header.split(' ')[1] 
    headers = {'Authorization': f'Bearer {token}'} 

    params = {
        'sysSn': sys_sn,
        'stationId': '',
    }
    response = requests.get(
        'https://monitor.byte-watt.com/api/report/energyStorage/getLastPowerData', 
        params=params, headers=headers, timeout=10
    )
    response.raise_for_status()

    data = response.json().get('data')
    return {
        'batteryPercent': data.get('soc'), # Single Value
        'generation': data.get('ppv'), # Single Value
        'consumption': data.get('pload'), # Single Value
        'batteryUsage': data.get('pbat'), # Single Value
        'gridUsage': data.get('pgrid'), # Single Value
    }
