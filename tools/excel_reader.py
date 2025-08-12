#!/usr/bin/env python3
import pandas as pd
import json
import sys

def read_excel_sheet(file_path, sheet_name):
    """读取Excel文件的指定sheet"""
    try:
        # 读取Excel文件，忽略样式
        df = pd.read_excel(file_path, sheet_name=sheet_name, engine='openpyxl')
        
        # 打印基本信息
        print(f"Sheet名称: {sheet_name}")
        print(f"行数: {len(df)}")
        print(f"列数: {len(df.columns)}")
        print("\n列名:")
        for i, col in enumerate(df.columns):
            print(f"  {i+1}. {col}")
        
        print("\n前5行数据:")
        print(df.head().to_string(index=False))
        
        # 输出为JSON格式以便进一步处理
        print("\n" + "="*50)
        print("JSON格式数据:")
        
        # 处理NaN值
        df_clean = df.fillna("")
        data = df_clean.to_dict('records')
        print(json.dumps(data, ensure_ascii=False, indent=2))
        
    except Exception as e:
        print(f"错误: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("用法: python3 excel_reader.py <excel文件路径> <sheet名称>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    sheet_name = sys.argv[2]
    read_excel_sheet(file_path, sheet_name)