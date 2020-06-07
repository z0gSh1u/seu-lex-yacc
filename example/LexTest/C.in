int Partition(int array[], int low, int high){
  int base = array[low];
  while(low < high){
    while(low < high && array[high] >= base){
      high--;
    }
    swap(array,low,high); // array[low] = array[high];
    while(low < high && array[low] <= base){
      low++;
    }
    swap(array,low,high); // array[high] = array[low];
  }
  array[low] = base;
  return low;
}
void QuickSort(int array[], int low, int high){
  if(low < high){
    int base = Partition(array,low,high);
    QuickSort(array,low,base - 1);
    QuickSort(array, base + 1, high);
  }
}