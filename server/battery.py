import requests
from flask import Flask, Blueprint, request

battery_bp = Blueprint('battery_bp', __name__, url_prefix='/battery')

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
        'systemSerialNum': data.get('sysSn'),
        'systemId': data.get('systemId'),
        'systemModel': data.get('minv'),
        'inverterPower': data.get('poinv'),
        'installedCapacity': data.get('cobat'),
        'usableCapacity': data.get('surpluscobat'),
        'usablePercentage': data.get('uscapacity')
    }

@battery_bp.route('graph_data', methods=['GET'])
def graph_data():
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
        'time': data.get('time'),
        'batteryPercent': data.get('cbat'),
        'gridExport': data.get('feedIn'),
        'gridImport': data.get('gridCharge'),
        'consumption': data.get('homePower'),
        'generation': data.get('ppv'),
    }

@battery_bp.route('summary_data', methods=['GET'])
def summary_data():
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
        'consumption': data.get('eload'),
        'generation': data.get('epvtoday'),
        'batteryCharged': data.get('echarge'),
        'batteryDischarged': data.get('edischarge'),
        'gridExport': data.get('eoutput'),
        'gridImport': data.get('einput'),
        'selfConsumption': data.get('eselfConsumption'),
        'selfSufficiency': data.get('eselfSufficiency'),
        'carbonReduction': data.get('carbonNum'),
        'treesPlanted': data.get('treeNum'),
        'incomeDaily': data.get('todayIncome'),
        'incomeTotal': data.get('totalIncome'),
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
        'batteryPercent': data.get('soc'),
        'generation': data.get('ppv'),
        'consumption': data.get('pload'),
        'batteryUsage': data.get('pbat'),
        'gridUsage': data.get('pgrid'),
    }

@battery_bp.route('income_data', methods=['GET'])
def income_data():
    pass